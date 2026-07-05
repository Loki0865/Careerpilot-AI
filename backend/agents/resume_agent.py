from google.adk.agents import Agent
from skills.resume_review_skill import review_resume_text
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

# Instantiate the Resume Agent
resume_agent = Agent(
    name="resume_agent",
    model=os.environ.get("GEMINI_MODEL", "gemini-2.5-flash"),
    instruction="""You are the CareerPilot AI Resume Agent.
    Your responsibilities:
    1. Analyze the uploaded resume (either provided directly as text or read from the filesystem using the 'read_file' tool).
    2. Suggest style, formatting, and layout improvements.
    3. Identify missing technical and soft skills depending on the candidate's target field.
    4. Detect weak, non-impactful bullet points (lacking action verbs or measurable metrics) and provide stronger rewrites.
    5. Recommend ATS (Applicant Tracking System) parser friendliness modifications.
    
    You have access to the 'review_resume_text' tool, which runs a thorough Gemini-backed analysis on the resume text.
    You also have access to the MCP filesystem server tools ('list_files', 'read_file') to find and fetch resumes from the safe uploads directory.
    When a file name is provided (e.g. 'my_resume.pdf'), call 'read_file' first to extract its content before reviewing it.
    """,
    tools=[review_resume_text, mcp_toolset]
)
