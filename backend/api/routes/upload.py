import os
import shutil
from fastapi import APIRouter, UploadFile, File, HTTPException
from services.ocr.extractor import extract_text_with_mistral

router = APIRouter()

@router.post("/")
async def process_statement(file: UploadFile = File(...)):
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file uploaded")
        
    temp_file_path = f"temp_{file.filename}"
    with open(temp_file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    try:
        extracted_text = extract_text_with_mistral(temp_file_path)
        return {
            "status": "success",
            "filename": file.filename,
            "markdown": extracted_text
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)
            