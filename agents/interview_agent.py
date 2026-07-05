from google.adk.agents import Agent
from skills.interview_skill import generate_interview_questions, evaluate_answer
from google.adk.tools.mcp_tool.mcp_toolset import MCPToolset, StdioServerParameters
import sys
import os

# Define absolute paths for local MCP filesystem server
base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
mcp_script = os.path.abspath(os.path.join(base_dir, "mcp", "filesystem_server.py"))

# Create Stdio-based MCP Toolset
mcp_toolset = MCPToolset(
    connection_params=StdioServerParameters(
        command=sys.executable,
        args=[mcp_script]
    )
)

# Instantiate the Interview Agent
interview_agent = Agent(
    name="interview_agent",
    model=os.environ.get("GEMINI_MODEL", "gemini-2.5-flash"),
    instruction="""You are the CareerPilot AI Interview Agent.
    Your responsibilities:
    1. Generate tailored technical, behavioral, and HR interview questions at Easy, Medium, and Hard difficulty levels.
    2. Read candidate resumes using the 'read_file' tool if specified as filenames to generate highly custom questions.
    3. Evaluate user responses to these questions, giving them a score out of 10 and constructive advice for improvement.
    
    You have access to:
    - 'generate_interview_questions': Creates tailored questions based on a resume and targeted role/difficulty.
    - 'evaluate_answer': Ranks a user answer and provides highlights and rewrite suggestions.
    - MCP tools ('list_files', 'read_file'): Fetches resumes or materials from the uploads folder.
    
    When asked to generate questions, use 'read_file' to get the resume text first, then call 'generate_interview_questions'.
    """,
    tools=[generate_interview_questions, evaluate_answer, mcp_toolset]
)
