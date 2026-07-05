import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Briefcase,
  FileText,
  MessageSquare,
  Kanban,
  ShieldCheck,
  Activity,
  ChevronRight,
  TrendingUp,
  Award,
  Calendar,
  DollarSign,
  Plus,
  Trash2,
  CheckCircle,
  Clock,
  AlertTriangle,
  Upload,
  User,
  LogOut,
  Play,
  RotateCcw,
  Sparkles,
  Info
} from 'lucide-react';

const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
  ? 'http://localhost:8000/api' 
  : '/api';

export default function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [dbStats, setDbStats] = useState({
    total_applications: 0,
    active_interviews: 0,
    average_ats_score: 0,
    total_job_matches: 0
  });
  const [activityLogs, setActivityLogs] = useState([]);
  const [securityStatus, setSecurityStatus] = useState({
    sandboxActive: true,
    fileLimitsChecked: true,
    antiInjectionShield: true,
    userConfirmationEnabled: true
  });

  const log_agent_action = (agent, action) => {
    const newLog = {
      timestamp: new Date().toLocaleTimeString(),
      agent,
      action
    };
    setActivityLogs(prev => [newLog, ...prev]);
  };


  // Fetch Dashboard Stats & Logs
  const fetchGlobalData = async () => {
    try {
      const statsRes = await axios.get(`${API_BASE}/dashboard/stats`);
      setDbStats(statsRes.data);
      
      const logsRes = await axios.get(`${API_BASE}/agent/activity`);
      setActivityLogs(logsRes.data);
    } catch (err) {
      console.error("Error fetching global metrics:", err);
    }
  };

  useEffect(() => {
    fetchGlobalData();
    // Poll logs every 5 seconds to keep the Agent Activity Panel fresh
    const interval = setInterval(fetchGlobalData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500/30 selection:text-emerald-400">
      
      {/* Sidebar Navigation */}
      {currentPage !== 'landing' && (
        <aside className="w-64 bg-slate-900/80 border-r border-slate-800 flex flex-col justify-between shrink-0 backdrop-blur-xl">
          <div>
            <div className="p-6 flex items-center gap-3 border-b border-slate-800/60">
              <div className="h-9 w-9 rounded-lg bg-emerald-500 flex items-center justify-center font-bold text-slate-950 text-lg shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                CP
              </div>
              <div>
                <h1 className="font-bold text-slate-100 tracking-tight text-sm">CareerPilot AI</h1>
                <span className="text-[10px] text-emerald-400 font-medium">ADK ACTIVE v1.0</span>
              </div>
            </div>
            
            <nav className="p-4 space-y-1">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
                { id: 'resume', label: 'Resume Analyzer', icon: FileText },
                { id: 'matcher', label: 'Job Matching', icon: Briefcase },
                { id: 'interview', label: 'Interview Prep', icon: MessageSquare },
                { id: 'tracker', label: 'Application Board', icon: Kanban },
              ].map((item) => {
                const Icon = item.icon;
                const active = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentPage(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                      active 
                        ? 'bg-emerald-500 text-slate-950 font-semibold shadow-[0_4px_12px_rgba(16,185,129,0.2)]' 
                        : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-100'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-4 border-t border-slate-800/60 bg-slate-900/40">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-300">
                <User className="h-4 w-4" />
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-slate-200">Guest Candidate</p>
                <p className="text-[10px] text-slate-500 truncate">guest@careerpilot.ai</p>
              </div>
            </div>
            <button 
              onClick={() => setCurrentPage('landing')}
              className="w-full flex items-center justify-center gap-2 py-2 border border-slate-800 hover:border-red-500/50 rounded-lg text-xs font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/5 transition-all"
            >
              <LogOut className="h-3 w-3" />
              Return to Landing
            </button>
          </div>
        </aside>
      )}

      {/* Main Panel */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header */}
        {currentPage !== 'landing' && (
          <header className="h-16 border-b border-slate-800/60 px-8 flex items-center justify-between bg-slate-900/20 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 capitalize text-sm">Workspace</span>
              <ChevronRight className="h-3 w-3 text-slate-600" />
              <span className="text-slate-100 font-semibold text-sm capitalize">{currentPage}</span>
            </div>
            
            {/* Quick Security Indicator */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 bg-emerald-950/40 border border-emerald-800/30 px-3 py-1.5 rounded-full">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span className="text-[10px] text-emerald-300 font-semibold tracking-wider uppercase">Sandbox Active</span>
              </div>
              <div className="flex items-center gap-2 bg-emerald-950/40 border border-emerald-800/30 px-3 py-1.5 rounded-full">
                <Sparkles className="h-4 w-4 text-emerald-400" />
                <span className="text-[10px] text-emerald-300 font-semibold tracking-wider uppercase">Gemini Connected</span>
              </div>
            </div>
          </header>
        )}

        <div className="flex-1 overflow-y-auto">
          {currentPage === 'landing' && <LandingPage onEnter={() => setCurrentPage('dashboard')} />}
          {currentPage === 'dashboard' && <Dashboard stats={dbStats} logs={activityLogs} fetchStats={fetchGlobalData} onNavigate={setCurrentPage} />}
          {currentPage === 'resume' && <ResumeAnalysis logs={activityLogs} onLogAction={log_agent_action} />}
          {currentPage === 'matcher' && <JobMatcher logs={activityLogs} onLogAction={log_agent_action} />}
          {currentPage === 'interview' && <InterviewPractice logs={activityLogs} onLogAction={log_agent_action} />}
          {currentPage === 'tracker' && <ApplicationTracker logs={activityLogs} onLogAction={log_agent_action} />}
        </div>
      </main>

    </div>
  );
}

// ==========================================
// PAGES & COMPONENTS
// ==========================================

// 1. LANDING PAGE
function LandingPage({ onEnter }) {
  return (
    <div className="min-h-screen bg-slate-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.12),rgba(255,255,255,0))] flex flex-col justify-between">
      
      {/* Navbar */}
      <header className="max-w-7xl mx-auto w-full px-8 py-6 flex items-center justify-between border-b border-slate-900">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-emerald-500 flex items-center justify-center font-bold text-slate-950 text-lg shadow-[0_0_15px_rgba(16,185,129,0.4)]">
            CP
          </div>
          <span className="font-bold text-lg tracking-tight text-white">CareerPilot AI</span>
        </div>
        <button 
          onClick={onEnter}
          className="px-5 py-2.5 bg-slate-900 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-800 rounded-lg text-sm font-semibold transition-all"
        >
          Developer Console
        </button>
      </header>

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-8 text-center py-20">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-950/40 text-emerald-400 text-xs font-semibold mb-6">
          <ShieldCheck className="h-3.5 w-3.5" />
          Production-Ready Google ADK Multi-Agent System
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-slate-400 tracking-tight leading-[1.1] mb-6">
          Navigate Your Job Search <br className="hidden md:inline" />
          with Autonomous AI Agents
        </h1>
        
        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
          CareerPilot AI is a secure, personal concierge system built on the Google Agent Development Kit (ADK) that automates resume optimization, job description alignment, and mock interviews.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={onEnter}
            className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all transform hover:-translate-y-0.5 flex items-center gap-2 text-base"
          >
            Launch Platform
            <ChevronRight className="h-5 w-5" />
          </button>
          <a 
            href="#architecture" 
            className="px-8 py-4 border border-slate-800 hover:border-slate-700 bg-slate-900/50 hover:bg-slate-900 rounded-lg text-slate-300 font-semibold transition-all text-base"
          >
            Explore Architecture
          </a>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="max-w-6xl mx-auto px-8 py-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            title: "Autonomous Collaboration",
            desc: "Career Manager routes tasks dynamically to dedicated sub-agents: Resume review, Match roadmaps, and Interview prep.",
            icon: Activity
          },
          {
            title: "Model Context Protocol",
            desc: "Communicates securely with local filesystem servers to parse binary DOCX and PDF documents inside a sandbox folder.",
            icon: Briefcase
          },
          {
            title: "Multi-Layered Security",
            desc: "Verifies file types, enforces size caps, prevents traversal injections, and prompts for confirmation before editing.",
            icon: ShieldCheck
          }
        ].map((feat, idx) => {
          const Icon = feat.icon;
          return (
            <div key={idx} className="p-8 bg-slate-900/40 border border-slate-800/60 rounded-2xl hover:border-emerald-500/20 transition-all hover:bg-slate-900/60">
              <div className="h-12 w-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-white text-lg mb-2">{feat.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{feat.desc}</p>
            </div>
          );
        })}
      </section>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto w-full px-8 py-8 border-t border-slate-900 text-center text-slate-600 text-xs">
        <p>© 22ef3f0b-c874-4757-85cb-ecd3e179fd89 - Google × Kaggle Capstone Project. All rights reserved.</p>
      </footer>
    </div>
  );
}

// 2. DASHBOARD VIEW
function Dashboard({ stats, logs, fetchStats, onNavigate }) {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      
      {/* Top Welcome Panel */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-900 pb-6">
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Main Console</h2>
          <p className="text-slate-400 text-sm mt-1">Autonomous orchestration statistics and actions for your career search.</p>
        </div>
        <button 
          onClick={fetchStats}
          className="flex items-center gap-2 px-4 py-2 border border-slate-800 hover:border-slate-700 bg-slate-900 rounded-lg text-xs font-semibold text-slate-300"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Refresh Stats
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Average ATS Score", val: `${stats.average_ats_score}%`, label: "Based on uploaded resumes", color: "text-emerald-400" },
          { title: "Tracked Applications", val: stats.total_applications, label: "Jobs logged in SQLite DB", color: "text-blue-400" },
          { title: "Active Interviews", val: stats.active_interviews, label: "Applications in progress", color: "text-purple-400" },
          { title: "Job Description Matches", val: stats.total_job_matches, label: "Matches generated", color: "text-amber-400" },
        ].map((item, idx) => (
          <div key={idx} className="p-6 bg-slate-900/60 border border-slate-800/80 rounded-xl flex flex-col justify-between">
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">{item.title}</p>
            <p className={`text-4xl font-extrabold my-3 ${item.color}`}>{item.val}</p>
            <span className="text-[10px] text-slate-500">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Quick Actions & Agent Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Actions */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 bg-slate-900/40 border border-slate-800/60 rounded-2xl">
            <h3 className="font-bold text-white mb-4 text-base flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-emerald-400" />
              Quick Assist Actions
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button 
                onClick={() => onNavigate('resume')}
                className="p-5 text-left bg-slate-900 border border-slate-800 hover:border-emerald-500/30 rounded-xl transition-all hover:bg-slate-800/40 flex flex-col justify-between group"
              >
                <div>
                  <FileText className="h-5 w-5 text-emerald-400 mb-3" />
                  <h4 className="font-semibold text-sm text-slate-200 group-hover:text-white">Review My Resume</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">Runs ATS scoring, keyword mapping, and bullet reviews.</p>
                </div>
                <span className="text-[10px] text-emerald-400 font-semibold mt-4 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Launch Scan <ChevronRight className="h-3 w-3" />
                </span>
              </button>
              
              <button 
                onClick={() => onNavigate('matcher')}
                className="p-5 text-left bg-slate-900 border border-slate-800 hover:border-emerald-500/30 rounded-xl transition-all hover:bg-slate-800/40 flex flex-col justify-between group"
              >
                <div>
                  <Briefcase className="h-5 w-5 text-emerald-400 mb-3" />
                  <h4 className="font-semibold text-sm text-slate-200 group-hover:text-white">Tailor to Job</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">Compares target Job Description for matching gaps.</p>
                </div>
                <span className="text-[10px] text-emerald-400 font-semibold mt-4 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Launch Matcher <ChevronRight className="h-3 w-3" />
                </span>
              </button>
            </div>
          </div>
          
          {/* Security Shield Info */}
          <div className="p-6 bg-slate-900/40 border border-slate-800/60 rounded-2xl space-y-4">
            <h3 className="font-bold text-white text-base flex items-center gap-2 border-b border-slate-800/40 pb-3">
              <ShieldCheck className="h-5 w-5 text-emerald-400" />
              Agent Security Shield
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: "Upload Sandboxing", desc: "Forced execution folder limits. Prevents directory traversals.", status: "Active" },
                { title: "Validation Layer", desc: "Type filtering (.pdf/.docx only) and 5MB size checks.", status: "Enforced" },
                { title: "Anti-Injection Protection", desc: "Parameters separation to stop malicious prompt payloads.", status: "Active" },
                { title: "User Write Consent", desc: "Prompts terminal/API before creating or modifying local files.", status: "Enabled" }
              ].map((sec, idx) => (
                <div key={idx} className="p-4 bg-slate-950 border border-slate-900 rounded-xl flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-emerald-400 mt-1.5 shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-xs text-slate-200">{sec.title}</h4>
                      <span className="text-[9px] bg-emerald-950/60 text-emerald-400 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">{sec.status}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">{sec.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Right - Visual Orchestration Activity */}
        <div className="lg:col-span-1">
          <AgentActivityPanel logs={logs} />
        </div>
        
      </div>
      
    </div>
  );
}

// 3. RESUME SCANNERS
function ResumeAnalysis({ logs, onLogAction }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [availableResumes, setAvailableResumes] = useState([]);

  const fetchResumesList = async () => {
    try {
      const res = await axios.get(`${API_BASE}/resume/list`);
      setAvailableResumes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchResumesList();
  }, []);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;
    
    setLoading(true);
    setReport(null);
    
    const formData = new FormData();
    formData.append("file", selectedFile);
    
    try {
      const res = await axios.post(`${API_BASE}/resume/review`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setReport(res.data);
      fetchResumesList();
    } catch (err) {
      alert(err.response?.data?.detail || "Review failed. Please check file properties and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* Scanner Form */}
      <div className="lg:col-span-2 space-y-6">
        <div className="p-6 bg-slate-900/60 border border-slate-800/80 rounded-2xl">
          <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
            <FileText className="h-5 w-5 text-emerald-400" />
            ATS Resume Optimization
          </h2>
          <p className="text-slate-400 text-xs mb-6">Select or upload your resume. Safe size limit is 5MB. Accepts PDF or DOCX only.</p>
          
          <form onSubmit={handleUploadSubmit} className="space-y-6">
            <div className="border-2 border-dashed border-slate-800 hover:border-emerald-500/40 rounded-xl p-8 flex flex-col items-center justify-center bg-slate-950/40 transition-all cursor-pointer relative">
              <input 
                type="file" 
                onChange={handleFileChange} 
                accept=".pdf,.docx" 
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <Upload className="h-10 w-10 text-slate-500 mb-3" />
              <span className="text-sm text-slate-300 font-medium">
                {selectedFile ? selectedFile.name : "Drag & drop or click to upload resume"}
              </span>
              <span className="text-[10px] text-slate-500 mt-1">PDF or DOCX (Max 5MB)</span>
            </div>

            <button 
              type="submit" 
              disabled={loading || !selectedFile}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Activity className="h-4 w-4 animate-pulse" />
                  Analyzing Resume...
                </>
              ) : (
                "Start ATS Scanner"
              )}
            </button>
          </form>
        </div>

        {/* Detailed Results Output */}
        {report && (
          <div className="p-6 bg-slate-900/60 border border-slate-800/80 rounded-2xl space-y-6 animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-800/60 pb-4">
              <div>
                <h3 className="font-bold text-white text-base">Resume Analysis Results</h3>
                <p className="text-[10px] text-slate-500">File: {report.file_name}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full border-2 border-emerald-500 flex items-center justify-center font-bold text-emerald-400 bg-emerald-950/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                  {report.ats_score}
                </div>
                <span className="text-xs text-slate-400 font-semibold">ATS Score</span>
              </div>
            </div>
            
            <div className="prose prose-invert prose-sm max-w-none bg-slate-950/50 p-6 border border-slate-900 rounded-xl overflow-y-auto max-h-[500px]">
              <pre className="whitespace-pre-wrap font-sans text-xs text-slate-300 leading-relaxed">
                {report.review_markdown}
              </pre>
            </div>
          </div>
        )}
      </div>
      
      {/* Side Reports Archive */}
      <div className="lg:col-span-1 space-y-6">
        <AgentActivityPanel logs={logs} />
        
        <div className="p-6 bg-slate-900/60 border border-slate-800/80 rounded-2xl">
          <h3 className="font-bold text-white mb-4 text-xs uppercase tracking-wider text-slate-400">Previous Review Reports</h3>
          <div className="space-y-3 max-h-[300px] overflow-y-auto">
            {availableResumes.length === 0 ? (
              <p className="text-slate-500 text-xs text-center py-4">No reviews generated yet.</p>
            ) : (
              availableResumes.map((item) => (
                <div 
                  key={item.id} 
                  onClick={() => setReport(item)}
                  className="p-3 bg-slate-950 border border-slate-900 hover:border-emerald-500/20 rounded-lg cursor-pointer transition-all flex items-center justify-between"
                >
                  <div className="overflow-hidden">
                    <p className="text-xs font-semibold text-slate-300 truncate">{item.file_name}</p>
                    <span className="text-[9px] text-slate-500">ATS Score: {item.ats_score}%</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-600" />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      
    </div>
  );
}

// 4. JOB MATCHERS
function JobMatcher({ logs, onLogAction }) {
  const [jdText, setJdText] = useState("");
  const [selectedResume, setSelectedResume] = useState("");
  const [resumesList, setResumesList] = useState([]);
  const [matchResult, setMatchResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previousMatches, setPreviousMatches] = useState([]);

  const fetchInitData = async () => {
    try {
      const resRes = await axios.get(`${API_BASE}/resume/list`);
      setResumesList(resRes.data);
      if (resRes.data.length > 0) {
        setSelectedResume(resRes.data[0].file_name);
      }
      
      const matchRes = await axios.get(`${API_BASE}/job/list`);
      setPreviousMatches(matchRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchInitData();
  }, []);

  const handleMatchSubmit = async (e) => {
    e.preventDefault();
    if (!selectedResume || !jdText.trim()) return;
    
    setLoading(true);
    setMatchResult(null);
    
    try {
      const res = await axios.post(`${API_BASE}/job/match`, {
        resume_name: selectedResume,
        jd_text: jdText
      });
      setMatchResult(res.data);
      fetchInitData();
    } catch (err) {
      alert("Match failed. Verify inputs and key.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      <div className="lg:col-span-2 space-y-6">
        <div className="p-6 bg-slate-900/60 border border-slate-800/80 rounded-2xl">
          <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-emerald-400" />
            Semantic Job Matcher
          </h2>
          <p className="text-slate-400 text-xs mb-6">Compare an uploaded resume against a job description. Finds matching overlaps, gaps, and roadmap steps.</p>
          
          <form onSubmit={handleMatchSubmit} className="space-y-6">
            
            {/* Resume Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">Select Reviewed Resume</label>
              {resumesList.length === 0 ? (
                <div className="p-3 bg-slate-950 border border-slate-850 text-slate-500 text-xs rounded-lg">
                  Please upload a resume in the Resume Analyzer first.
                </div>
              ) : (
                <select
                  value={selectedResume}
                  onChange={(e) => setSelectedResume(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-300 focus:outline-none focus:border-emerald-500/50"
                >
                  {resumesList.map((item) => (
                    <option key={item.id} value={item.file_name}>{item.file_name} (Score: {item.ats_score}%)</option>
                  ))}
                </select>
              )}
            </div>

            {/* Paste JD Text */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">Paste Job Description</label>
              <textarea
                value={jdText}
                onChange={(e) => setJdText(e.target.value)}
                placeholder="Paste the requirements, skills, and details of the job role..."
                rows={8}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-300 focus:outline-none focus:border-emerald-500/50 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !selectedResume || !jdText.trim()}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Activity className="h-4 w-4 animate-pulse" />
                  Orchestrating Gap Matcher...
                </>
              ) : (
                "Calculate Match Score"
              )}
            </button>
            
          </form>
        </div>

        {/* Match Result Display */}
        {matchResult && (
          <div className="p-6 bg-slate-900/60 border border-slate-800/80 rounded-2xl space-y-6 animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-800/60 pb-4">
              <div>
                <h3 className="font-bold text-white text-base">Match Report & Roadmap</h3>
                <p className="text-[10px] text-slate-500">Comparison complete</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full border-2 border-emerald-500 flex items-center justify-center font-bold text-emerald-400 bg-emerald-950/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                  {matchResult.match_percentage}%
                </div>
                <span className="text-xs text-slate-400 font-semibold">Match Score</span>
              </div>
            </div>
            
            <div className="prose prose-invert prose-sm max-w-none bg-slate-950/50 p-6 border border-slate-900 rounded-xl overflow-y-auto max-h-[500px]">
              <pre className="whitespace-pre-wrap font-sans text-xs text-slate-300 leading-relaxed">
                {matchResult.review_markdown}
              </pre>
            </div>
          </div>
        )}
      </div>

      {/* Side Archives */}
      <div className="lg:col-span-1 space-y-6">
        <AgentActivityPanel logs={logs} />
        
        <div className="p-6 bg-slate-900/60 border border-slate-800/80 rounded-2xl">
          <h3 className="font-bold text-white mb-4 text-xs uppercase tracking-wider text-slate-400">Previous Matches</h3>
          <div className="space-y-3 max-h-[300px] overflow-y-auto">
            {previousMatches.length === 0 ? (
              <p className="text-slate-500 text-xs text-center py-4">No match reviews generated yet.</p>
            ) : (
              previousMatches.map((item) => (
                <div 
                  key={item.id} 
                  onClick={() => setMatchResult(item)}
                  className="p-3 bg-slate-950 border border-slate-900 hover:border-emerald-500/20 rounded-lg cursor-pointer transition-all flex items-center justify-between"
                >
                  <div className="overflow-hidden">
                    <p className="text-xs font-semibold text-slate-300 truncate">{item.resume_name}</p>
                    <span className="text-[9px] text-slate-500">Match score: {item.match_percentage}%</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-600" />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      
    </div>
  );
}

// 5. INTERVIEW PRACTICE PANEL
function InterviewPractice({ logs, onLogAction }) {
  const [roleTitle, setRoleTitle] = useState("Python Backend Developer");
  const [difficulty, setDifficulty] = useState("Medium");
  const [resumesList, setResumesList] = useState([]);
  const [selectedResume, setSelectedResume] = useState("");
  const [interviewText, setInterviewText] = useState("");
  
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [answerInput, setAnswerInput] = useState("");
  const [evalReport, setEvalReport] = useState(null);
  
  const [generating, setGenerating] = useState(false);
  const [grading, setGrading] = useState(false);
  const [historyList, setHistoryList] = useState([]);

  const fetchInitData = async () => {
    try {
      const resRes = await axios.get(`${API_BASE}/resume/list`);
      setResumesList(resRes.data);
      if (resRes.data.length > 0) {
        setSelectedResume(resRes.data[0].file_name);
      }
      
      const historyRes = await axios.get(`${API_BASE}/interview/history`);
      setHistoryList(historyRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchInitData();
  }, []);

  const handleGenerateQuestions = async (e) => {
    e.preventDefault();
    if (!selectedResume) {
      alert("Please upload a resume first.");
      return;
    }
    
    setGenerating(true);
    setInterviewText("");
    setCurrentQuestion("");
    setEvalReport(null);
    
    const formData = new FormData();
    formData.append("resume_name", selectedResume);
    formData.append("role_title", roleTitle);
    formData.append("difficulty", difficulty);
    
    try {
      const res = await axios.post(`${API_BASE}/interview/generate`, formData);
      setInterviewText(res.data.questions);
      setCurrentQuestion(res.data.questions);
    } catch (err) {
      alert("Error generating interview questions.");
    } finally {
      setGenerating(false);
    }
  };

  const handleEvaluateSubmit = async (e) => {
    e.preventDefault();
    if (!answerInput.trim()) return;
    
    setGrading(true);
    setEvalReport(null);
    
    try {
      const res = await axios.post(`${API_BASE}/interview/evaluate`, {
        question: currentQuestion || "Tell me about your technical project.",
        answer: answerInput
      });
      setEvalReport(res.data);
      setAnswerInput("");
      fetchInitData();
    } catch (err) {
      alert("Grading failed.");
    } finally {
      setGrading(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* Generator & Practice Chat */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Setup Config */}
        <div className="p-6 bg-slate-900/60 border border-slate-800/80 rounded-2xl">
          <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-emerald-400" />
            AI Interview Simulator
          </h2>
          <p className="text-slate-400 text-xs mb-6">Generates tailored interview prompts based on your resume. Complete answers to receive immediate grading.</p>
          
          <form onSubmit={handleGenerateQuestions} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-[10px] font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Select Resume</label>
              <select
                value={selectedResume}
                onChange={(e) => setSelectedResume(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-300 focus:outline-none focus:border-emerald-500/50"
              >
                {resumesList.map((item) => (
                  <option key={item.id} value={item.file_name}>{item.file_name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-[10px] font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Role Title</label>
              <input 
                type="text" 
                value={roleTitle}
                onChange={(e) => setRoleTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-300 focus:outline-none"
              />
            </div>
            
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-[10px] font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Difficulty</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-300 focus:outline-none"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
              
              <button
                type="submit"
                disabled={generating || !selectedResume}
                className="px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg transition-all flex items-center justify-center shrink-0 disabled:opacity-50"
              >
                {generating ? <Activity className="h-4 w-4 animate-spin" /> : "Build QA"}
              </button>
            </div>
          </form>
        </div>

        {/* Live Simulator Chat Panel */}
        {(interviewText || currentQuestion) && (
          <div className="p-6 bg-slate-900/60 border border-slate-800/80 rounded-2xl space-y-6">
            
            {/* The Active Question */}
            <div className="bg-slate-950/60 p-4 border border-slate-800/40 rounded-xl space-y-2">
              <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-bold tracking-wider uppercase">Active Interview Prompts</span>
              <div className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed max-h-[300px] overflow-y-auto">
                {interviewText ? interviewText : "Let's start! Tell me about your background and how your skills align with this role."}
              </div>
            </div>

            {/* Answer Input Submission */}
            <form onSubmit={handleEvaluateSubmit} className="space-y-4">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">Your Answer</label>
              <textarea
                value={answerInput}
                onChange={(e) => setAnswerInput(e.target.value)}
                placeholder="Format your answer using the STAR method (Situation, Task, Action, Result) for the best evaluation report..."
                rows={5}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-300 focus:outline-none focus:border-emerald-500/50 resize-none"
              />
              <button
                type="submit"
                disabled={grading || !answerInput.trim()}
                className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-xs"
              >
                {grading ? (
                  <>
                    <Activity className="h-3.5 w-3.5 animate-spin" />
                    Reviewing Answer Response...
                  </>
                ) : (
                  "Submit Answer for Grading"
                )}
              </button>
            </form>
          </div>
        )}

        {/* Feedback Sheet */}
        {evalReport && (
          <div className="p-6 bg-slate-900/60 border border-slate-800/80 rounded-2xl space-y-6 animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-800/60 pb-4">
              <div>
                <h3 className="font-bold text-white text-base">Grading Feedback report</h3>
                <p className="text-[10px] text-slate-500">Evaluation complete</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full border-2 border-emerald-500 flex items-center justify-center font-bold text-emerald-400 bg-emerald-950/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                  {evalReport.score}/10
                </div>
                <span className="text-xs text-slate-400 font-semibold">Grade Score</span>
              </div>
            </div>
            
            <div className="prose prose-invert prose-sm max-w-none bg-slate-950/50 p-6 border border-slate-900 rounded-xl overflow-y-auto max-h-[400px]">
              <pre className="whitespace-pre-wrap font-sans text-xs text-slate-300 leading-relaxed font-normal">
                {evalReport.feedback}
              </pre>
            </div>
          </div>
        )}
        
      </div>

      {/* Side Logs and Archives */}
      <div className="lg:col-span-1 space-y-6">
        <AgentActivityPanel logs={logs} />
        
        <div className="p-6 bg-slate-900/60 border border-slate-800/80 rounded-2xl">
          <h3 className="font-bold text-white mb-4 text-xs uppercase tracking-wider text-slate-400">Interview History</h3>
          <div className="space-y-3 max-h-[300px] overflow-y-auto">
            {historyList.length === 0 ? (
              <p className="text-slate-500 text-xs text-center py-4">No previous history found.</p>
            ) : (
              historyList.map((item) => (
                <div 
                  key={item.id}
                  onClick={() => setEvalReport(item)}
                  className="p-3 bg-slate-950 border border-slate-900 hover:border-emerald-500/20 rounded-lg cursor-pointer transition-all flex items-center justify-between"
                >
                  <div className="overflow-hidden">
                    <p className="text-xs font-semibold text-slate-300 truncate">{item.question}</p>
                    <span className="text-[9px] text-slate-500">Score: {item.score}/10</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-600" />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      
    </div>
  );
}

// 6. APPLICATION TRACKER (SQLite Table CRUD)
function ApplicationTracker({ logs, onLogAction }) {
  const [applications, setApplications] = useState([]);
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("Applied");
  const [salary, setSalary] = useState("");
  const [deadline, setDeadline] = useState("");
  const [notes, setNotes] = useState("");
  
  const [filterStatus, setFilterStatus] = useState("All");

  const fetchApplications = async () => {
    try {
      const res = await axios.get(`${API_BASE}/applications`);
      setApplications(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleAddApplication = async (e) => {
    e.preventDefault();
    if (!company.trim() || !role.trim()) return;
    
    try {
      await axios.post(`${API_BASE}/applications`, {
        company,
        role,
        status,
        salary: salary || null,
        deadline: deadline || null,
        notes: notes || null
      });
      // Clear inputs
      setCompany("");
      setRole("");
      setSalary("");
      setDeadline("");
      setNotes("");
      fetchApplications();
    } catch (err) {
      alert("Error adding application record.");
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await axios.put(`${API_BASE}/applications/${id}`, {
        status: newStatus
      });
      fetchApplications();
    } catch (err) {
      alert("Status update failed.");
    }
  };

  const handleDeleteApplication = async (id) => {
    if (!confirm("Are you sure you want to delete this application record?")) return;
    try {
      await axios.delete(`${API_BASE}/applications/${id}`);
      fetchApplications();
    } catch (err) {
      alert("Delete failed.");
    }
  };

  const filteredApps = filterStatus === 'All' 
    ? applications 
    : applications.filter(app => app.status === filterStatus);

  return (
    <div className="p-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* Applications Table list */}
      <div className="lg:col-span-2 space-y-6">
        <div className="p-6 bg-slate-900/60 border border-slate-800/80 rounded-2xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/60 pb-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Kanban className="h-5 w-5 text-emerald-400" />
                Job Application Tracker
              </h2>
              <span className="text-[10px] text-slate-500">Persistent SQLite Database storage</span>
            </div>
            
            {/* Filter selectors */}
            <div className="flex gap-2">
              {['All', 'Applied', 'Interviewing', 'Offer', 'Rejected'].map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-3 py-1 rounded-full text-[10px] font-semibold transition-all border ${
                    filterStatus === st 
                      ? 'bg-emerald-500 text-slate-950 border-emerald-500 shadow-md' 
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800/60 text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-2">Company</th>
                  <th className="py-3 px-2">Role</th>
                  <th className="py-3 px-2">Status</th>
                  <th className="py-3 px-2">Deadline</th>
                  <th className="py-3 px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {filteredApps.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-500">No applications matched the criteria.</td>
                  </tr>
                ) : (
                  filteredApps.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-900/20 group">
                      <td className="py-4 px-2 font-bold text-white">{app.company}</td>
                      <td className="py-4 px-2 text-slate-300">{app.role}</td>
                      <td className="py-4 px-2">
                        <select
                          value={app.status}
                          onChange={(e) => handleUpdateStatus(app.id, e.target.value)}
                          className="bg-slate-950 border border-slate-800/80 rounded px-2.5 py-1 text-[10px] font-semibold text-slate-300 focus:outline-none"
                        >
                          <option value="Applied">Applied</option>
                          <option value="Interviewing">Interviewing</option>
                          <option value="Offer">Offer</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </td>
                      <td className="py-4 px-2 text-slate-400">{app.deadline || "None"}</td>
                      <td className="py-4 px-2 text-right">
                        <button 
                          onClick={() => handleDeleteApplication(app.id)}
                          className="p-2 border border-slate-800 hover:border-red-500/50 hover:bg-red-500/10 text-slate-500 hover:text-red-400 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Log application form */}
      <div className="lg:col-span-1 space-y-6">
        <div className="p-6 bg-slate-900/60 border border-slate-800/80 rounded-2xl space-y-4">
          <h3 className="font-bold text-white text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800/40 pb-2">Log New Application</h3>
          
          <form onSubmit={handleAddApplication} className="space-y-4">
            <div>
              <label className="block text-[10px] font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Company</label>
              <input 
                type="text" 
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Google"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-300 focus:outline-none"
              />
            </div>
            
            <div>
              <label className="block text-[10px] font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Role Title</label>
              <input 
                type="text" 
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="API Platform Engineer"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-300 focus:outline-none"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-300 focus:outline-none"
                >
                  <option value="Applied">Applied</option>
                  <option value="Interviewing">Interviewing</option>
                  <option value="Offer">Offer</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
              
              <div>
                <label className="block text-[10px] font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Deadline</label>
                <input 
                  type="text" 
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  placeholder="July 15"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-300 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add referral name, links, or follow-up details..."
                rows={3}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-300 focus:outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg transition-all text-xs flex items-center justify-center gap-1.5"
            >
              <Plus className="h-4 w-4" />
              Add to DB Tracker
            </button>
          </form>
        </div>
        
        <AgentActivityPanel logs={logs} />
      </div>
      
    </div>
  );
}

// 7. AGENT ACTIVITY PANEL
function AgentActivityPanel({ logs }) {
  return (
    <div className="p-6 bg-slate-900/60 border border-slate-800/80 rounded-2xl flex flex-col justify-between h-[450px]">
      <div>
        <h3 className="font-bold text-white mb-1.5 text-xs uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Activity className="h-4 w-4 text-emerald-400 animate-pulse" />
          Agent Activity Panel
        </h3>
        <span className="text-[9px] text-slate-500 block border-b border-slate-850 pb-3 mb-4">Orchestration pipeline execution logs</span>
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {logs.length === 0 ? (
          <p className="text-slate-600 text-xs text-center py-10">No agent actions recorded yet.</p>
        ) : (
          logs.map((log, idx) => {
            let badgeColor = "bg-slate-900 text-slate-400 border-slate-800";
            if (log.agent === "Career Manager") badgeColor = "bg-blue-950/40 text-blue-400 border-blue-900/30";
            if (log.agent === "Resume Agent") badgeColor = "bg-purple-950/40 text-purple-400 border-purple-900/30";
            if (log.agent === "Job Match Agent") badgeColor = "bg-amber-950/40 text-amber-400 border-amber-900/30";
            if (log.agent === "Interview Agent") badgeColor = "bg-emerald-950/40 text-emerald-400 border-emerald-900/30";
            if (log.agent === "Tracker Agent") badgeColor = "bg-pink-950/40 text-pink-400 border-pink-900/30";
            if (log.agent === "Filesystem MCP") badgeColor = "bg-teal-950/40 text-teal-400 border-teal-900/30";

            return (
              <div key={idx} className="text-[11px] leading-relaxed border-l-2 border-slate-800/60 pl-3 py-0.5 space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`px-1.5 py-0.5 text-[8px] font-bold rounded uppercase tracking-wider border ${badgeColor}`}>
                    {log.agent}
                  </span>
                  <span className="text-[8px] text-slate-600 font-medium">{log.timestamp}</span>
                </div>
                <p className="text-slate-300 font-normal">{log.action}</p>
              </div>
            );
          })
        )}
      </div>
      
      <div className="mt-4 border-t border-slate-850 pt-3 flex items-center justify-between text-[10px] text-slate-500">
        <span>Active Sub-Agents: 4</span>
        <div className="flex items-center gap-1.5">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping"></div>
          <span className="font-semibold text-emerald-400">System Live</span>
        </div>
      </div>
    </div>
  );
}
