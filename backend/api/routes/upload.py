from fastapi import APIRouter, UploadFile, File, HTTPException
from services.ocr.extractor import extract_text_with_mistral
from services.llm.extractor import parse_ocr_to_transactions

router = APIRouter()

@router.post("/")
async def process_statement(file: UploadFile = File(...)):
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file uploaded")

    try:
        # Read raw binary data directly into RAM (no disk writing!)
        contents = await file.read()
        
        # Step 1 — OCR
        extracted_text = extract_text_with_mistral(contents, file.filename)
        
        # Step 2 — LLM Parse
        transactions = parse_ocr_to_transactions(extracted_text)
        
        return {
            "status": "success",
            "filename": file.filename,
            "transaction_count": len(transactions),
            "transactions": transactions
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    