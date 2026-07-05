from google.adk.agents import Agent
from .resume_agent import resume_agent
from .job_match_agent import job_match_agent
from .interview_agent import interview_agent
from google.adk.tools.mcp_tool.mcp_toolset import MCPToolset, StdioServerParameters
import sys
import os

# Define absolute paths for local MCP filesystem server
base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
mcp_script = os.path.abspath(os.path.join(base_dir, "mcp", "filesystem_server.py"))

# Create Stdio-based MCP Toolset for the manager
mcp_toolset = MCPToolset(
    connection_params=StdioServerParameters(
        command=sys.executable,
        args=[mcp_script]
    )
)

# Instantiate the Main Orchestrator Agent
career_manager = Agent(
    name="career_manager",
    model=os.environ.get("GEMINI_MODEL", "gemini-2.5-flash"),
    instruction="""You are the Main Orchestrator of CareerPilot AI.
    Your role is to receive user requests, understand their intent, and delegate to the appropriate specialized agent:
    - To review, improve, structure, or optimize a resume: Delegate to 'resume_agent'.
    - To match a resume to a job description, identify missing skills, or calculate match percentage: Delegate to 'job_match_agent'.
    - To practice interviews, generate questions, or evaluate answers: Delegate to 'interview_agent'.
    
    Always present yourself as the CareerPilot AI assistant. When a specialized agent finishes a task, consolidate and summarize their output clearly.
    You also have access to the MCP filesystem tools ('list_files', 'read_file') to search and read documents in the uploads folder.
    """,
    sub_agents=[resume_agent, job_match_agent, interview_agent],
    tools=[mcp_toolset]
)
