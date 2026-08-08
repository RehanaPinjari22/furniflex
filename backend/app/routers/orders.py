from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload

from app.core.deps import get_current_user
from app.database import get_db
from app.models.cart import CartItem
from app.models.order import Order, OrderItem
from app.models.user import User
from app.schemas.order import CheckoutRequest, OrderOut

router = APIRouter(prefix="/api/orders", tags=["orders"])

PLAN_PRICE_FIELD = {
    "Monthly": "monthly_price",
    "Quarterly": "quarterly_price",
    "Yearly": "yearly_price",
}

PAYMENT_METHODS = {"CARD", "UPI", "GPAY_QR"}


def _order_query(db: Session):
    return db.query(Order).options(
        joinedload(Order.items).joinedload(OrderItem.product),
        joinedload(Order.items).joinedload(OrderItem.rental_plan),
    )


@router.post("/checkout", response_model=OrderOut, status_code=201)
def checkout(
    payload: CheckoutRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    cart_items = (
        db.query(CartItem)
        .options(joinedload(CartItem.product), joinedload(CartItem.rental_plan))
        .filter(CartItem.user_id == current_user.id)
        .all()
    )
    if not cart_items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    if payload.payment_method not in PAYMENT_METHODS:
        raise HTTPException(status_code=400, detail=f"payment_method must be one of {sorted(PAYMENT_METHODS)}")

    total = 0.0
    order_items = []
    for cart_item in cart_items:
        price_field = PLAN_PRICE_FIELD.get(cart_item.rental_plan.name, "monthly_price")
        unit_price = float(getattr(cart_item.product, price_field))
        total += unit_price * cart_item.quantity
        order_items.append(
            OrderItem(
                product_id=cart_item.product_id,
                rental_plan_id=cart_item.rental_plan_id,
                quantity=cart_item.quantity,
                price_at_order=unit_price,
            )
        )

    order = Order(
        user_id=current_user.id,
        total_amount=total,
        shipping_address=payload.shipping_address,
        payment_method=payload.payment_method,
        payment_reference=payload.payment_reference,
        items=order_items,
    )
    db.add(order)
    db.query(CartItem).filter(CartItem.user_id == current_user.id).delete()
    db.commit()
    db.refresh(order)
    return _order_query(db).filter(Order.id == order.id).first()


@router.get("", response_model=list[OrderOut])
def list_my_orders(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return (
        _order_query(db)
        .filter(Order.user_id == current_user.id)
        .order_by(Order.created_at.desc())
        .all()
    )


@router.get("/{order_id}", response_model=OrderOut)
def get_order(
    order_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    order = _order_query(db).filter(Order.id == order_id).first()
    if not order or (order.user_id != current_user.id and not current_user.is_admin):
        raise HTTPException(status_code=404, detail="Order not found")
    return order
