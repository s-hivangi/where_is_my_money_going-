from fastapi import APIRouter

router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.get("/summary")
def summary() -> dict[str, object]:
	return {"total_spent": 69700, "savings_rate": 18, "top_category": "Rent"}
