from pydantic import BaseModel, ConfigDict

from app.schemas.product import ProductListOut
from app.schemas.rental_plan import RentalPlanOut


class CartItemCreate(BaseModel):
    product_id: int
    rental_plan_id: int
    quantity: int = 1


class CartItemUpdate(BaseModel):
    rental_plan_id: int | None = None
    quantity: int | None = None


class CartItemOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    product: ProductListOut
    rental_plan: RentalPlanOut
    quantity: int
