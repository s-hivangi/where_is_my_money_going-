from fastapi import APIRouter

router = APIRouter(prefix="/transactions", tags=["transactions"])


@router.get("/")
def list_transactions() -> dict[str, list[dict[str, object]]]:
	return {
		"items": [
			{"id": 1, "description": "Rent", "amount": 15000, "category": "Housing"},
			{"id": 2, "description": "Groceries", "amount": 4200, "category": "Food"},
		]
	}
