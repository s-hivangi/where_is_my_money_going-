from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/upload", tags=["upload"])


class UploadRequest(BaseModel):
	filename: str


@router.post("/")
def upload_statement(payload: UploadRequest) -> dict[str, str]:
	return {"filename": payload.filename, "status": "received"}
