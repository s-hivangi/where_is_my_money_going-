import os
from mistralai.client import Mistral

def extract_text_with_mistral(file_bytes: bytes, filename: str) -> str:
    api_key = os.getenv("MISTRAL_API_KEY")
    if not api_key:
        raise ValueError("MISTRAL_API_KEY is missing from your .env file.")
        
    client = Mistral(api_key=api_key)
    
    try:
        # Pass the raw bytes directly to Mistral's file upload
        uploaded_file = client.files.upload(
            file={
                "file_name": filename,
                "content": file_bytes,
            },
            purpose="ocr"
        )
            
        signed_url = client.files.get_signed_url(file_id=uploaded_file.id)
        
        ocr_response = client.ocr.process(
            model="mistral-ocr-latest",
            document={
                "type": "document_url",
                "document_url": signed_url.url
            }
        )
        
        markdown_text = "\n\n".join([page.markdown for page in ocr_response.pages])
        
        # Clean up the file from Mistral's servers
        client.files.delete(file_id=uploaded_file.id)
        
        return markdown_text

    except Exception as e:
        raise RuntimeError(f"Mistral OCR processing failed: {str(e)}")
    