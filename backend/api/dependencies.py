from fastapi import Header, HTTPException, status

from auth.jwt import verify_access_token
from config import settings


def get_settings():
	return settings


def get_current_user(authorization: str | None = Header(default=None)) -> dict[str, str]:
	if not authorization or not authorization.lower().startswith("bearer "):
		raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing bearer token")

	token = authorization.split(" ", 1)[1].strip()
	try:
		payload = verify_access_token(token)
	except ValueError as exc:
		raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid bearer token") from exc

	return {"sub": payload.sub}
