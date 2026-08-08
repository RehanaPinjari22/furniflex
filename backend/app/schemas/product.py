from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.schemas.category import CategoryOut


class ProductBase(BaseModel):
    name: str
    category_id: int
    description: str
    image_urls: list[str] = []
    monthly_price: float
    quarterly_price: float
    yearly_price: float
    deposit: float = 0
    stock_qty: int = 10
    is_featured: bool = False


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    name: str | None = None
    category_id: int | None = None
    description: str | None = None
    image_urls: list[str] | None = None
    monthly_price: float | None = None
    quarterly_price: float | None = None
    yearly_price: float | None = None
    deposit: float | None = None
    stock_qty: int | None = None
    is_featured: bool | None = None


class ProductOut(ProductBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
    category: CategoryOut | None = None


class ProductListOut(BaseModel):
    """Lightweight product representation used for list/grid views."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    category_id: int
    image_urls: list[str] = []
    monthly_price: float
    quarterly_price: float
    yearly_price: float
    is_featured: bool
