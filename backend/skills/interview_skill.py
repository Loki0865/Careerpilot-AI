from google import genai
import os

def get_genai_client():
    return genai.Client()

def generate_interview_questions(resume_text: str, role_title: str = "Software Engineer", difficulty: str = "Medium") -> str:
    """
    Generates interview questions (Technical, Behavioral, HR) based on resume details and targeted role.
    Accepts difficulty: 'Easy', 'Medium', or 'Hard'.
    Returns a list of questions in Markdown.
    """
    if not resume_text or not resume_text.strip():
        return "Error: Resume text is empty."
        
    client = get_genai_client()
    
    prompt = f"""
    You are an expert interviewer.
    Generate a set of 3 tailored interview questions based on the candidate's resume for the role of '{role_title}'.
    Difficulty level: {difficulty}.
    
    Provide:
    1. One **Technical Question** focusing on technical projects or skills listed in the resume.
    2. One **Behavioral Question** focusing on teamwork, problem solving, or leadership examples from their experience.
    3. One **HR/Fit Question** assessing role alignment and career goals.
    
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
        return f"Error generating interview questions: {str(e)}"

def evaluate_answer(question: str, user_answer: str) -> str:
    """
    Evaluates a candidate's answer to a specific interview question.
    Returns a score (1-10) and detailed constructive feedback in Markdown.
    """
    if not question or not question.strip():
        return "Error: Question is empty."
    if not user_answer or not user_answer.strip():
        return "Error: Answer is empty."
        
    client = get_genai_client()
    
    prompt = f"""
    You are an expert interviewer and communication coach.
    Evaluate the candidate's response to the following interview question.
    
    Question:
    {question}
    
    Candidate's Answer:
    {user_answer}
    
    Provide:
    1. **Score**: A numerical score from 1 to 10.
    2. **What Went Well**: Highlights of strong points, structure (e.g. STAR method if applicable), and clarity.
    3. **Areas for Improvement**: Specific points where the response was vague, lacked detail, or could be phrased better.
    4. **Suggested Revision**: Provide an exemplary rewritten answer showing how they could communicate this more effectively.
    """
    
    try:
        model_name = os.environ.get("GEMINI_MODEL", "gemini-2.5-flash")
        response = client.models.generate_content(
            model=model_name,
            contents=prompt
        )
        return response.text
    except Exception as e:
        return f"Error evaluating interview answer: {str(e)}"
