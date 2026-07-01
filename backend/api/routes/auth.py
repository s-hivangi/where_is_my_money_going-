from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from auth.jwt import create_access_token

router = APIRouter(prefix="/auth", tags=["auth"])


class LoginRequest(BaseModel):
	username: str
	password: str


@router.post("/login")
def login(payload: LoginRequest) -> dict[str, str]:
	if not payload.username or not payload.password:
		raise HTTPException(status_code=400, detail="Username and password are required")

	return {"access_token": create_access_token(payload.username), "token_type": "bearer"}
