from sqlalchemy import Integer, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class RentalPlan(Base):
    """A rental duration tier, e.g. Monthly / Quarterly / Yearly."""

    __tablename__ = "rental_plans"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    duration_months: Mapped[int] = mapped_column(Integer, nullable=False)
    discount_percent: Mapped[float] = mapped_column(Numeric(5, 2), default=0)

    cart_items = relationship("CartItem", back_populates="rental_plan")
    order_items = relationship("OrderItem", back_populates="rental_plan")
