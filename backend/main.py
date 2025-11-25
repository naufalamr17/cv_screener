from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import shutil
import os
import tempfile
import fitz  # PyMuPDF
import pytesseract
from PIL import Image
import io
from rapidfuzz import fuzz

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- TESSERACT CONFIGURATION ---
# If Tesseract is not in your PATH, uncomment the line below and point to your installation
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

def extract_text_from_pdf(file_path: str) -> str:
    print(f"Processing file with PyMuPDF: {file_path}")
    text = ""
    try:
        doc = fitz.open(file_path)
        
        for page_num, page in enumerate(doc):
            # 1. Try to get text directly
            page_text = page.get_text()
            text += page_text + "\n"
            
            # 2. If text is sparse on this page, convert page to image and OCR
            # This handles scanned PDFs perfectly without Poppler
            if len(page_text.strip()) < 50:
                print(f"Page {page_num+1} has little text, rendering to image for OCR...")
                pix = page.get_pixmap()
                img_data = pix.tobytes("png")
                image = Image.open(io.BytesIO(img_data))
                
                ocr_result = pytesseract.image_to_string(image)
                text += "\n[OCR Content]:\n" + ocr_result + "\n"
                
        doc.close()
            
    except Exception as e:
        print(f"Error processing PDF: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to process PDF: {str(e)}")

    return text

@app.post("/upload")
async def upload_cvs(
    files: List[UploadFile] = File(...),
    keywords: str = Form(...)
):
    results = []
    keyword_list = [k.strip().lower() for k in keywords.split(',')]
    
    # Create a temporary directory to save uploaded files
    with tempfile.TemporaryDirectory() as temp_dir:
        for file in files:
            try:
                file_path = os.path.join(temp_dir, file.filename)
                with open(file_path, "wb") as buffer:
                    shutil.copyfileobj(file.file, buffer)
                
                # Extract text
                content = extract_text_from_pdf(file_path)
                content_lower = content.lower()
                
                # Check for keywords using Fuzzy Matching
                matched_keywords = []
                for keyword in keyword_list:
                    # Check for exact match first (faster)
                    if keyword in content_lower:
                        matched_keywords.append(keyword)
                        continue
                    
                    # Fuzzy match: Check if keyword is present with some tolerance
                    if fuzz.partial_ratio(keyword, content_lower) >= 85:
                        matched_keywords.append(f"{keyword} (approx)")
                
                # Calculate score
                score = len(matched_keywords)
                
                print(f"Extracted text for {file.filename} ({len(content)} chars):\n{content[:100]}...") # Debug log

                # ALWAYS return the result, even if score is 0
                results.append({
                    "filename": file.filename,
                    "matches": matched_keywords,
                    "score": score,
                    "snippet": content[:500] + "..." if content else "No text extracted." # Longer preview
                })
            except Exception as e:
                print(f"Error processing file {file.filename}: {e}")
                results.append({
                    "filename": file.filename,
                    "error": str(e),
                    "score": 0,
                    "snippet": "Error during processing."
                })

    # Sort results by score descending
    results.sort(key=lambda x: x.get("score", 0), reverse=True)
    
    return {"results": results}

@app.get("/")
def read_root():
    return {"message": "CV Screening API is running"}
