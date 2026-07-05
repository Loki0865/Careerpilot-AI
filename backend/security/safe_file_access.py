import os
import sys

# Define base directory relative to the security/ folder
BASE_DIR = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
SAFE_UPLOAD_DIR = os.path.abspath(os.path.join(BASE_DIR, 'uploads'))

# Ensure safe upload directory exists
os.makedirs(SAFE_UPLOAD_DIR, exist_ok=True)

def is_safe_path(filepath: str, base_dir: str = SAFE_UPLOAD_DIR) -> bool:
    """
    Checks if the filepath resolves to a path strictly within the allowed base directory.
    Prevents directory traversal attacks (e.g., ../../../etc/passwd).
    """
    resolved_base = os.path.abspath(base_dir)
    resolved_path = os.path.abspath(filepath)
    
    # Check if the resolved path starts with the base directory path
    return resolved_path.startswith(resolved_base)

def get_safe_path(filename: str, base_dir: str = SAFE_UPLOAD_DIR) -> str:
    """
    Helper that constructs a safe path for a filename, raising PermissionError if traversal is attempted.
    """
    if os.path.isabs(filename):
        target_path = os.path.abspath(filename)
    else:
        target_path = os.path.abspath(os.path.join(base_dir, filename))
        
    if not is_safe_path(target_path, base_dir):
        raise PermissionError(f"Security Alert: Blocked directory access attempt for path '{target_path}' outside allowed root.")
    return target_path

def ask_user_confirmation(action_description: str) -> bool:
    """
    Asks the user for explicit confirmation via the console before modifying files.
    """
    print(f"\n[SECURITY CONFIRMATION REQUIRED]")
    print(f"Action: {action_description}")
    
    # If not running in a terminal, auto-reject for security unless explicitly overridden
    if not sys.stdin.isatty():
        print("Non-interactive shell detected: Auto-rejecting file modification.")
        return False
        
    try:
        response = input("Confirm this action? (yes/no): ").strip().lower()
        return response in {'yes', 'y'}
    except Exception as e:
        print(f"Error reading confirmation: {e}")
        return False

def safe_write_file(filename: str, content: str, base_dir: str = SAFE_UPLOAD_DIR, force: bool = False, api_mode: bool = False) -> str:
    """
    Writes content to a file inside the safe directory after verification and user confirmation.
    """
    safe_path = get_safe_path(filename, base_dir)
    
    action_desc = f"Write/Overwrite file '{os.path.basename(safe_path)}' in safe upload directory."
    if not force and not api_mode:
        if not ask_user_confirmation(action_desc):
            raise PermissionError("User rejected the file write request.")
            
    with open(safe_path, 'w', encoding='utf-8') as f:
        f.write(content)
        
    return safe_path
