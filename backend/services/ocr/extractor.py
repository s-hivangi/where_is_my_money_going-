import os
from pathlib import Path
from mistralai.client import Mistral

def extract_text_with_mistral(file_path: str) -> str:

    #Takes a local file path, sends it to Mistral OCR, and returns the extracted markdown text.
    
    api_key = os.getenv("MISTRAL_API_KEY")
    if not api_key:
        raise ValueError("MISTRAL_API_KEY is missing from your .env file.")
        
    client = Mistral(api_key=api_key)
    path = Path(file_path)
    
    try:
        # 1. Upload the file to Mistral's temporary storage
        with open(path, "rb") as f:
            uploaded_file = client.files.upload(
                file={
                    "file_name": path.name,
                    "content": f.read(),
                },
                purpose="ocr"
            )
            
        # 2. Get a signed URL so the OCR engine can read it
        signed_url = client.files.get_signed_url(file_id=uploaded_file.id)
        
        # 3. Process the document using the Mistral OCR API
        ocr_response = client.ocr.process(
            model="mistral-ocr-latest",
            document={
                "type": "document_url",
                "document_url": signed_url.url
            }
        )
        
        # 4. Combine the markdown from all pages
        markdown_text = "\n\n".join([page.markdown for page in ocr_response.pages])
        
        # 5. Clean up: Delete the file from Mistral's servers
        client.files.delete(file_id=uploaded_file.id)
        
        return markdown_text

    except Exception as e:
        raise RuntimeError(f"Mistral OCR processing failed: {str(e)}")
    