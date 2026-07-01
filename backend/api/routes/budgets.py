from fastapi import APIRouter

router = APIRouter(prefix="/budgets", tags=["budgets"])


@router.get("/")
def list_budgets() -> dict[str, list[dict[str, object]]]:
	return {"items": [{"category": "Food", "limit": 15000, "spent": 8700}]}
