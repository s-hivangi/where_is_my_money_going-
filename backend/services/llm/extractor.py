import os
import json
from mistralai.client import Mistral

def parse_ocr_to_transactions(markdown_text: str) -> list:
    """
    Takes raw OCR markdown from a bank statement or receipt 
    and uses Mistral's LLM to extract structured JSON transactions.
    """
    api_key = os.getenv("MISTRAL_API_KEY")
    if not api_key:
        raise ValueError("MISTRAL_API_KEY is missing from your .env file.")
        
    client = Mistral(api_key=api_key)
    
    prompt = f"""
    You are an expert financial data parser. 
    Extract all financial transactions from the following bank statement or receipt markdown.
    Return ONLY a valid JSON array of objects. Each object must have these exact keys:
    - "date": string (YYYY-MM-DD format)
    - "description": string (merchant or transaction description)
    - "amount": float (positive for income, negative for expenses/debits)
    - "type": string ("DEBIT" or "CREDIT")
    - "category": string (e.g., Groceries, Utilities, Entertainment, Salary, Shopping, Dining, Transport)

    Here is the document content:
    {markdown_text}
    """

    try:
        response = client.chat.complete(
            model="mistral-small-latest", # Fast and efficient for extraction
            messages=[
                {"role": "system", "content": "You output strictly valid JSON arrays and nothing else."},
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"} # Forces JSON output
        )
        
        content = response.choices[0].message.content
        parsed_data = json.loads(content)
        
        # Handle cases where the LLM wraps the array in an outer dictionary key
        if isinstance(parsed_data, dict):
            for key in parsed_data:
                if isinstance(parsed_data[key], list):
                    return parsed_data[key]
            return [parsed_data]
            
        return parsed_data

    except Exception as e:
        raise RuntimeError(f"LLM parsing failed: {str(e)}")
    