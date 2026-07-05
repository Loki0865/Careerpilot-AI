from sqlalchemy import Column, Integer, String, Float, Text, ForeignKey, DateTime
from sqlalchemy.orm import declarative_base, relationship
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    applications = relationship("Application", back_populates="user", cascade="all, delete-orphan")
    interviews = relationship("InterviewHistory", back_populates="user", cascade="all, delete-orphan")
    resumes = relationship("ResumeReport", back_populates="user", cascade="all, delete-orphan")
    matches = relationship("JobMatch", back_populates="user", cascade="all, delete-orphan")

class Application(Base):
    __tablename__ = "applications"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    company = Column(String(100), nullable=False)
    role = Column(String(100), nullable=False)
    status = Column(String(50), default="Applied") # Applied, Interviewing, Offer, Rejected
    salary = Column(String(50), nullable=True)
    applied_date = Column(DateTime, default=datetime.utcnow)
    notes = Column(Text, nullable=True)
    deadline = Column(String(100), nullable=True)
    
    user = relationship("User", back_populates="applications")

class InterviewHistory(Base):
    __tablename__ = "interview_history"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    role = Column(String(100), nullable=False)
    difficulty = Column(String(50), nullable=False)
    question = Column(Text, nullable=False)
    user_answer = Column(Text, nullable=False)
    score = Column(Integer, nullable=False) # 1 to 10
    feedback = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="interviews")

class ResumeReport(Base):
    __tablename__ = "resume_reports"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    file_name = Column(String(150), nullable=False)
    file_path = Column(String(250), nullable=False)
    ats_score = Column(Integer, nullable=False)
    review_markdown = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="resumes")

class JobMatch(Base):
    __tablename__ = "job_matches"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    resume_name = Column(String(150), nullable=False)
    job_title = Column(String(150), nullable=False)
    match_percentage = Column(Integer, nullable=False)
    review_markdown = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="matches")
