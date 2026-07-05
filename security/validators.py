import os
import re

ALLOWED_EXTENSIONS = {'.pdf', '.docx'}
MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024  # 5 MB

def validate_file_type(filename: str) -> bool:
    """
    Validates if the file has an allowed extension (only .pdf or .docx).
    """
    _, ext = os.path.splitext(filename.lower())
    return ext in ALLOWED_EXTENSIONS

def validate_file_size(filepath: str, max_bytes: int = MAX_FILE_SIZE_BYTES) -> bool:
    """
    Validates that the file size is under the specified limit.
    """
    if not os.path.exists(filepath):
        return False
    return os.path.getsize(filepath) <= max_bytes

def sanitize_input_text(text: str) -> str:
    """
    Sanitizes string inputs to prevent basic injection attempts and clean control characters.
    """
    # Remove control characters except newlines and tabs
    sanitized = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f\x7f-\xff]', '', text)
    return sanitized.strip()
