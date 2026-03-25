import pdfplumber
import docx

def extract_text(file_bytes: bytes, filename: str) -> str:
    if filename.endswith(".pdf"):
        return _extract_from_pdf(file_bytes)
    elif  filename.endswith((".doc", ".docx")):
        return _extract_from_docx(file_bytes)
    else:
        raise ValueError("Unsupported file type")
    
def _extract_from_pdf(file_bytes:bytes) -> str:
    import io
    with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
        return "\n".join(page.extract_text() or "" for page in pdf.pages)


def _extract_from_docx(file_bytes: bytes) -> str:
    import io
    doc = docx.Document(io.BytesIO(file_bytes))
    return "\n".join(para.text for para in doc.paragraphs)
    
