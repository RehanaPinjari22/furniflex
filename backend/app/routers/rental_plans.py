from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.rental_plan import RentalPlan
from app.schemas.rental_plan import RentalPlanOut

router = APIRouter(prefix="/api/rental-plans", tags=["rental-plans"])


@router.get("", response_model=list[RentalPlanOut])
def list_rental_plans(db: Session = Depends(get_db)):
    return db.query(RentalPlan).order_by(RentalPlan.duration_months).all()
