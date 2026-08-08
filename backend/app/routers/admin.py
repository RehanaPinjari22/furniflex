import re
import uuid

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from pydantic import BaseModel
from sqlalchemy.orm import Session, joinedload

from app.config import IMAGES_DIR
from app.core.deps import get_current_admin
from app.database import get_db
from app.models.category import Category
from app.models.order import Order, OrderItem
from app.models.product import Product
from app.models.user import User
from app.schemas.order import OrderAdminOut
from app.schemas.user import UserOut

ORDER_STATUSES = {"PLACED", "CONFIRMED", "DELIVERED", "RETURNED", "CANCELLED"}

ALLOWED_IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif"}
MAX_UPLOAD_BYTES = 5 * 1024 * 1024  # 5MB
SLUG_PATTERN = re.compile(r"^[a-z0-9-]+$")


class OrderStatusUpdate(BaseModel):
    status: str

router = APIRouter(prefix="/api/admin", tags=["admin"], dependencies=[Depends(get_current_admin)])


@router.post("/upload-image")
async def upload_image(category_slug: str = Form(...), file: UploadFile = File(...)):
    """Saves an admin-uploaded image into static/images/<category_slug>/ and
    returns its served URL. Used for both product and category images — the
    frontend groups everything by category folder for easy browsing on disk."""
    if not SLUG_PATTERN.match(category_slug):
        raise HTTPException(status_code=400, detail="category_slug must be lowercase letters, numbers and hyphens")

    extension = "." + (file.filename or "").rsplit(".", 1)[-1].lower() if "." in (file.filename or "") else ""
    if extension not in ALLOWED_IMAGE_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type. Allowed: {sorted(ALLOWED_IMAGE_EXTENSIONS)}",
        )

    contents = await file.read()
    if len(contents) > MAX_UPLOAD_BYTES:
        raise HTTPException(status_code=400, detail="File too large (max 5MB)")

    folder = IMAGES_DIR / category_slug
    folder.mkdir(parents=True, exist_ok=True)

    filename = f"{uuid.uuid4().hex}{extension}"
    (folder / filename).write_bytes(contents)

    return {"url": f"/static/images/{category_slug}/{filename}"}


@router.get("/dashboard")
def dashboard_stats(db: Session = Depends(get_db)):
    return {
        "total_products": db.query(Product).count(),
        "total_categories": db.query(Category).count(),
        "total_users": db.query(User).count(),
        "total_orders": db.query(Order).count(),
        "revenue": float(sum(o.total_amount for o in db.query(Order).all())),
    }


@router.get("/users", response_model=list[UserOut])
def list_users(db: Session = Depends(get_db)):
    return db.query(User).order_by(User.created_at.desc()).all()


@router.get("/orders", response_model=list[OrderAdminOut])
def list_all_orders(db: Session = Depends(get_db)):
    return (
        db.query(Order)
        .options(
            joinedload(Order.user),
            joinedload(Order.items).joinedload(OrderItem.product),
            joinedload(Order.items).joinedload(OrderItem.rental_plan),
        )
        .order_by(Order.created_at.desc())
        .all()
    )


@router.patch("/orders/{order_id}/status", response_model=OrderAdminOut)
def update_order_status(order_id: int, payload: OrderStatusUpdate, db: Session = Depends(get_db)):
    if payload.status not in ORDER_STATUSES:
        raise HTTPException(status_code=400, detail=f"Status must be one of {sorted(ORDER_STATUSES)}")

    order = (
        db.query(Order)
        .options(
            joinedload(Order.user),
            joinedload(Order.items).joinedload(OrderItem.product),
            joinedload(Order.items).joinedload(OrderItem.rental_plan),
        )
        .filter(Order.id == order_id)
        .first()
    )
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    order.status = payload.status
    db.commit()
    db.refresh(order)
    return order
