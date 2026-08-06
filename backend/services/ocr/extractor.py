import os
from io import BytesIO

from mistralai.client import Mistral
from pypdf import PdfReader, PdfWriter


def _decrypt_pdf(file_bytes: bytes, password: str | None) -> bytes:
    reader = PdfReader(BytesIO(file_bytes))

    if not reader.is_encrypted:
        return file_bytes

    if not password:
        raise ValueError("PDF is password-protected. Please enter the PDF password.")

    if reader.decrypt(password) == 0:
        raise ValueError("Incorrect PDF password.")

    writer = PdfWriter()
    for page in reader.pages:
        writer.add_page(page)

    output = BytesIO()
    writer.write(output)
    return output.getvalue()

def extract_text_with_mistral(file_bytes: bytes, filename: str, password: str | None = None) -> str:
    api_key = os.getenv("MISTRAL_API_KEY")
    if not api_key:
        raise ValueError("MISTRAL_API_KEY is missing from your .env file.")
        
    client = Mistral(api_key=api_key)
    
    try:
        decrypted_bytes = _decrypt_pdf(file_bytes, password)

        # Pass the raw bytes directly to Mistral's file upload
        uploaded_file = client.files.upload(
            file={
                "file_name": filename,
                "content": decrypted_bytes,
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
    