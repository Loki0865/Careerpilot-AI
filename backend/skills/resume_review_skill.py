from google import genai
import os

def get_genai_client():
    return genai.Client()

def review_resume_text(resume_text: str) -> str:
    """
    Reviews resume text for formatting, missing technical skills, weak bullet points, and ATS compatibility.
    Returns a detailed Markdown report containing suggestions.
    """
    if not resume_text or not resume_text.strip():
        return "Error: Resume text is empty."
        
    client = get_genai_client()
    
    prompt = f"""
    You are an expert resume reviewer and ATS (Applicant Tracking System) optimizer.
    Analyze the following resume text and provide a structured, professional evaluation report in Markdown.
    
    In your evaluation, include:
    1. **Overall Assessment**: A brief summary of the resume's strengths.
    2. **Weak Bullet Points**: Identify bullet points that lack metrics, action verbs, or impact, and provide rewritten alternatives.
    3. **Missing Technical Skills**: Identify typical modern technical skills that might be missing depending on the candidate's field.
    4. **ATS Recommendations**: Provide concrete recommendations for parsing formatting, keyword density, and layout optimization.
    5. **Actionable Suggestions**: 3-5 immediate steps the candidate can take.
    
    Resume Text:
    {resume_text}
    """
    
    try:
        model_name = os.environ.get("GEMINI_MODEL", "gemini-2.5-flash")
        response = client.models.generate_content(
            model=model_name,
            contents=prompt
        )
        return response.text
    except Exception as e:
        return f"Error during resume review analysis: {str(e)}"
