import os
import shutil
from fastapi import APIRouter, UploadFile, File, HTTPException
from services.ocr.extractor import extract_text_with_mistral
from services.llm.extractor import parse_ocr_to_transactions

router = APIRouter()

@router.post("/")
async def upload_and_process_statement(file: UploadFile = File(...)):
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file uploaded")
        
    temp_file_path = f"temp_{file.filename}"
    with open(temp_file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    try:
        # Step 1: Run OCR
        markdown_text = extract_text_with_mistral(temp_file_path)
        
        # Step 2: Run LLM parsing on the OCR output
        transactions = parse_ocr_to_transactions(markdown_text)
        
        return {
            "status": "success",
            "filename": file.filename,
            "transaction_count": len(transactions),
            "transactions": transactions
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)
            