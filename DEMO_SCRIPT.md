# CareerPilot AI: Video Demo Script 🎥

**Title**: CareerPilot AI - Full-Stack Multi-Agent Career Console  
**Host**: Capstone Developer  
**Duration**: 2.5 Minutes (Approx. 350 words)  

---

## ⏱️ Video Timeline & Script

### **0:00 - 0:25 | Intro & The Problem**
* **Visual**: Show a student typing on a laptop, surrounded by tabs of resumes, LinkedIn, and spreadsheets. Pits this against the sleek, dark-themed CareerPilot AI landing page.
* **Audio**: "Job hunting is a full-time job. Candidates spend hours tailoring resumes, calculating match rates, preparing for mock interviews, and managing spreadsheets of applications. Welcome to **CareerPilot AI**, a secure, full-stack personal career concierge that automates these workflows using collaborating AI agents."

### **0:25 - 0:50 | Architecture & Orchestration**
* **Visual**: Transition to the **Architecture diagram** in the README, highlighting the **Google Agent Development Kit (ADK)**. Show the **Agent Activity Panel** on the live UI.
* **Audio**: "CareerPilot AI uses a hierarchical multi-agent architecture powered by Google ADK. A central **Career Manager Agent** coordinates tasks, delegating to specialized sub-agents: the Resume Agent, the Job Match Agent, the Interview Agent, and the new Application Tracker Agent. The UI's Agent Activity Panel lets you see these orchestrations happen in real time."

### **0:50 - 1:15 | Security & Sandbox**
* **Visual**: Mouse over the **Agent Security Shield** panel on the UI showing: Upload Sandboxing, Validation Layer, and confirm prompts active.
* **Audio**: "Security is baked into our design. CareerPilot AI only parses PDF and DOCX files under 5MB. Files are read securely inside a sandbox directory using a custom local **Model Context Protocol (MCP)** filesystem server. Directory traversal attacks are completely blocked at the file layer."

### **1:15 - 2:15 | Live Walkthrough**
* **Visual**: Screen capture of the live web app (localhost:8000).
  1. **Dashboard**: Show the global stats and recent activity feed.
  2. **Resume Analyzer**: Upload `jane_doe_resume.docx`. Show the ATS score loading and the detailed markdown report listing missing skills and bullet rewrites.
  3. **Job Match**: Paste the python backend job description. Click match. Show the match score dial, skill gaps, and custom learning roadmap.
  4. **Interview Simulator**: Click generate questions. Type an answer to the first question, click evaluate, and display the graded score (e.g., 8/10) with detailed feedback.
  5. **Application Tracker**: Navigate to the tracker. Add a new application for 'Google - API Engineer' and show it being saved to the SQLite database.
* **Audio**: "Let's run a live scan. We upload a junior resume. The Resume Agent processes it, giving us an overall ATS score and recommending concrete bullet rewrites. Next, we check job alignment. We paste a Python backend job description, and the Job Match Agent reports our skill gaps—noting we lack FastAPI and Docker—and structures a learning roadmap. For interview prep, the simulator generates questions matching our resume. We submit an answer, and the Interview Agent grades our communication structure. Finally, we log this application into our SQLite database, updating our dashboard statistics automatically."

### **2:15 - 2:30 | Outro**
* **Visual**: Slide showing the GitHub repository, requirements, and course completion badges.
* **Audio**: "CareerPilot AI demonstrates state-of-the-art agent coordination, database persistence, and secure local file access—all delivered on a single local port. Start managing your career hunt smarter. Thank you!"
