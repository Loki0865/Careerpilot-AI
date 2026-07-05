import os
import sys

# Add parent directory to sys.path to allow database import
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database.db import SessionLocal
from database.models import Application, User
from datetime import datetime

def _get_guest_user_id(db):
    user = db.query(User).filter(User.username == "guest_user").first()
    return user.id if user else 1

def db_add_application(company: str, role: str, status: str = "Applied", salary: str = None, deadline: str = None, notes: str = None) -> str:
    """
    Saves a new job application to the database tracker.
    Allowed statuses: 'Applied', 'Interviewing', 'Offer', 'Rejected'.
    """
    db = SessionLocal()
    try:
        user_id = _get_guest_user_id(db)
        app = Application(
            user_id=user_id,
            company=company,
            role=role,
            status=status,
            salary=salary,
            deadline=deadline,
            notes=notes,
            applied_date=datetime.utcnow()
        )
        db.add(app)
        db.commit()
        return f"Successfully added application: '{role}' at '{company}' with status '{status}'."
    except Exception as e:
        db.rollback()
        return f"Error adding application: {str(e)}"
    finally:
        db.close()

def db_update_application_status(app_id: int, status: str) -> str:
    """
    Updates the status of an existing job application by ID.
    Allowed statuses: 'Applied', 'Interviewing', 'Offer', 'Rejected'.
    """
    if status not in {"Applied", "Interviewing", "Offer", "Rejected"}:
        return f"Error: Status must be one of: 'Applied', 'Interviewing', 'Offer', 'Rejected'."
        
    db = SessionLocal()
    try:
        app = db.query(Application).filter(Application.id == app_id).first()
        if not app:
            return f"Error: Job application with ID {app_id} not found."
            
        app.status = status
        db.commit()
        return f"Successfully updated application ID {app_id} ('{app.role}' at '{app.company}') status to '{status}'."
    except Exception as e:
        db.rollback()
        return f"Error updating application status: {str(e)}"
    finally:
        db.close()

def db_get_applications_stats() -> str:
    """
    Generates statistics on all tracked job applications including counts and conversion rates.
    """
    db = SessionLocal()
    try:
        user_id = _get_guest_user_id(db)
        apps = db.query(Application).filter(Application.user_id == user_id).all()
        
        total = len(apps)
        if total == 0:
            return "No job applications found in the tracker database. Start adding applications to view statistics!"
            
        status_counts = {"Applied": 0, "Interviewing": 0, "Offer": 0, "Rejected": 0}
        for app in apps:
            if app.status in status_counts:
                status_counts[app.status] += 1
            
        interview_rate = ((status_counts["Interviewing"] + status_counts["Offer"]) / total * 100) if total > 0 else 0
        offer_rate = (status_counts["Offer"] / total * 100) if total > 0 else 0
        
        report = f"""
### Job Application Statistics Report 📊
- **Total Applications Submitted**: {total}
- **Status Breakdown**:
  - 📝 *Applied*: {status_counts['Applied']}
  - 💬 *Interviewing*: {status_counts['Interviewing']}
  - 🎉 *Offers Received*: {status_counts['Offer']}
  - ❌ *Rejections*: {status_counts['Rejected']}
- **Conversion Metrics**:
  - 📈 *Interview Rate*: {interview_rate:.1f}% (Percentage of applications reaching interview stages)
  - 🏆 *Success Rate*: {offer_rate:.1f}% (Percentage of applications resulting in offers)
        """
        return report.strip()
    except Exception as e:
        return f"Error gathering application statistics: {str(e)}"
    finally:
        db.close()

def db_get_upcoming_deadlines() -> str:
    """
    Lists upcoming application deadlines or follow-ups saved in notes.
    """
    db = SessionLocal()
    try:
        user_id = _get_guest_user_id(db)
        apps = db.query(Application).filter(
            Application.user_id == user_id,
            Application.deadline.isnot(None),
            Application.deadline != ""
        ).all()
        
        if not apps:
            return "No upcoming deadlines or follow-ups found in your tracker."
            
        lines = ["### Upcoming Job Tracker Deadlines 📅"]
        for app in apps:
            lines.append(f"- **{app.company}** - *{app.role}* (Status: {app.status}) | Deadline: **{app.deadline}**")
            
        return "\n".join(lines)
    except Exception as e:
        return f"Error retrieving deadlines: {str(e)}"
    finally:
        db.close()
