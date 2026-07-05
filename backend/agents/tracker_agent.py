from google.adk.agents import Agent
from skills.tracker_skill import (
    db_add_application, 
    db_update_application_status, 
    db_get_applications_stats, 
    db_get_upcoming_deadlines
)
import os

# Instantiate the Application Tracker Agent
tracker_agent = Agent(
    name="tracker_agent",
    model=os.environ.get("GEMINI_MODEL", "gemini-2.5-flash"),
    instruction="""You are the CareerPilot AI Application Tracker Agent.
    Your responsibility is to manage and report on the candidate's job application database.
    
    You have access to the following database tools:
    1. 'db_add_application': Add a new application to the database. Required: company, role. Optional: status ('Applied', 'Interviewing', 'Offer', 'Rejected'), salary, deadline, notes.
    2. 'db_update_application_status': Change status of an application by ID. Required: app_id (int), status.
    3. 'db_get_applications_stats': Generate statistics report on conversion rates and offer counts.
    4. 'db_get_upcoming_deadlines': Lists upcoming follow-ups and deadlines.
    
    Use these tools dynamically to respond to user application queries. Report success confirmations or data summaries clearly.
    """,
    tools=[db_add_application, db_update_application_status, db_get_applications_stats, db_get_upcoming_deadlines]
)
