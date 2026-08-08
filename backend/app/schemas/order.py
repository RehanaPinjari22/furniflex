from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.schemas.product import ProductListOut
from app.schemas.rental_plan import RentalPlanOut
from app.schemas.user import UserOut


class CheckoutRequest(BaseModel):
    shipping_address: str
    payment_method: str = "CARD"
    payment_reference: str | None = None


class OrderItemOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    product: ProductListOut
    rental_plan: RentalPlanOut
    quantity: int
    price_at_order: float


class OrderOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    status: str
    total_amount: float
    shipping_address: str
    payment_method: str
    payment_reference: str | None = None
    created_at: datetime
    items: list[OrderItemOut] = []


class OrderAdminOut(OrderOut):
    user: UserOut | None = None
