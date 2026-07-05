import os
import sys
import uvicorn
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Add backend/ directory to sys.path to allow absolute imports
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "backend")))

def main():
    print("=" * 70)
    print("🚀 Starting CareerPilot AI Web Application Server...")
    print("=" * 70)
    
    # Verify GEMINI_API_KEY
    if not os.environ.get("GEMINI_API_KEY"):
        print("[WARNING] GEMINI_API_KEY environment variable is not set.")
        print("Please add your key in the '.env' file before invoking AI agents.")
        
    print("Open the following URL in your web browser:")
    print("👉 http://localhost:8000")
    print("-" * 70)
    
    # Run the uvicorn server pointing to the FastAPI app in backend/api/main.py
    uvicorn.run("backend.api.main:app", host="127.0.0.1", port=8000, reload=True)

if __name__ == "__main__":
    main()
