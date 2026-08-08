from pydantic import BaseModel, ConfigDict


class RentalPlanOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    duration_months: int
    discount_percent: float
