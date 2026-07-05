from google.adk.agents import Agent
from skills.jd_match_skill import match_resume_to_jd
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

# Instantiate the Job Match Agent
job_match_agent = Agent(
    name="job_match_agent",
    model=os.environ.get("GEMINI_MODEL", "gemini-2.5-flash"),
    instruction="""You are the CareerPilot AI Job Match Agent.
    Your responsibilities:
    1. Accept a candidate's resume and a target job description (JD).
    2. Read files using the 'read_file' tool if the resume or JD are specified as filenames.
    3. Evaluate skill overlaps and calculate a match percentage score.
    4. Return matching skills, missing skills, and actionable tailoring suggestions.
    
    You have access to the 'match_resume_to_jd' tool, which does a detailed semantic comparison.
    You also have access to the MCP filesystem server tools ('list_files', 'read_file') to retrieve files.
    Ensure you extract text from both the resume and the job description files before performing the match.
    """,
    tools=[match_resume_to_jd, mcp_toolset]
)
