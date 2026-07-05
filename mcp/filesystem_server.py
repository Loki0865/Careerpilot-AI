import sys
import os

# Add the parent directory to sys.path to allow imports from security/
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from security.validators import validate_file_type, validate_file_size
from security.safe_file_access import get_safe_path, SAFE_UPLOAD_DIR

from fastmcp import FastMCP
from pypdf import PdfReader
import docx

# Initialize FastMCP Server
mcp = FastMCP("CareerPilot-Filesystem")

@mcp.tool()
def list_files() -> str:
    """
    Lists all allowed resumes (.pdf or .docx) inside the safe upload directory.
    """
    try:
        if not os.path.exists(SAFE_UPLOAD_DIR):
            return "No upload directory exists yet."
            
        files = os.listdir(SAFE_UPLOAD_DIR)
        allowed_files = [f for f in files if validate_file_type(f)]
        if not allowed_files:
            return "No valid uploaded files (.pdf or .docx) found in the upload directory."
        return "\n".join(allowed_files)
    except Exception as e:
        return f"Error listing files: {str(e)}"

@mcp.tool()
def read_file(filename: str) -> str:
    """
    Reads and returns the parsed text content of an uploaded resume.
    Validates that the file type is allowed, the file size is under the limit, and the path is safe.
    """
    try:
        # Verify path safety and resolve absolute path
        safe_path = get_safe_path(filename, SAFE_UPLOAD_DIR)
        
        if not os.path.exists(safe_path):
            return f"Error: File '{filename}' not found."
            
        # Validate file type and size
        if not validate_file_type(filename):
            return f"Security Error: File '{filename}' has an unsupported extension. Only PDF and DOCX are allowed."
            
        if not validate_file_size(safe_path):
            return f"Security Error: File '{filename}' exceeds the maximum allowed size of 5MB."
            
        _, ext = os.path.splitext(filename.lower())
        
        if ext == ".pdf":
            reader = PdfReader(safe_path)
            text = ""
            for i, page in enumerate(reader.pages):
                page_text = page.extract_text()
                if page_text:
                    text += f"--- Page {i+1} ---\n" + page_text + "\n"
            return text if text.strip() else "Warning: PDF file is empty or contains no extractable text."
            
        elif ext == ".docx":
            doc = docx.Document(safe_path)
            text = []
            for para in doc.paragraphs:
                text.append(para.text)
            return "\n".join(text)
            
        else:
            return f"Error: Unsupported file format '{ext}'."
            
    except PermissionError as pe:
        return f"Security Violation: {str(pe)}"
    except Exception as e:
        return f"Error reading file '{filename}': {str(e)}"

if __name__ == "__main__":
    mcp.run()
