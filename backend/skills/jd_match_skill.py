from google import genai
import os

def get_genai_client():
    return genai.Client()

def match_resume_to_jd(resume_text: str, jd_text: str) -> str:
    """
    Compares resume text with a job description.
    Returns a Markdown report detailing match percentage, matching skills, missing skills, and tailoring suggestions.
    """
    if not resume_text or not resume_text.strip():
        return "Error: Resume text is empty."
    if not jd_text or not jd_text.strip():
        return "Error: Job description text is empty."
        
    client = get_genai_client()
    
    prompt = f"""
    You are an expert technical recruiter and career coach.
    Compare the following Resume with the Job Description (JD). Provide a detailed analysis report in Markdown.
    
    In your report, include:
    1. **Match Percentage**: Give a realistic score (0-100%) indicating how well the candidate fits the requirements. Explain the score briefly.
    2. **Matching Skills**: Bulleted list of skills/technologies mentioned in both the resume and the JD.
    3. **Missing Skills & Gaps**: Bulleted list of critical skills, tools, or experiences requested in the JD that are absent or poorly highlighted in the resume.
    4. **Tailoring Suggestions**: Actionable advice on how to rewrite or re-structure the resume to better highlight fit for this specific job.
    
    Resume Text:
    {resume_text}
    
    Job Description:
    {jd_text}
    """
    
    try:
        model_name = os.environ.get("GEMINI_MODEL", "gemini-2.5-flash")
        response = client.models.generate_content(
            model=model_name,
            contents=prompt
        )
        return response.text
    except Exception as e:
        return f"Error during resume to JD matching: {str(e)}"
