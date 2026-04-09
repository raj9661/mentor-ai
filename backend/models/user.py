import uuid
from sqlalchemy import Column, String, Integer, DateTime, Text, ARRAY
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(Text, nullable=False)
    email = Column(Text, nullable=False, unique=True, index=True)
    password_hash = Column(Text, nullable=False)
    role = Column(Text, nullable=False)  # 'student' | 'parent'
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class StudentProfile(Base):
    __tablename__ = "student_profiles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), nullable=False, unique=True, index=True)
    age = Column(Integer, nullable=True)
    class_level = Column(Text, nullable=True)
    city = Column(Text, nullable=True)
    interests = Column(ARRAY(Text), nullable=True)
    skills = Column(ARRAY(Text), nullable=True)
    personality = Column(Text, nullable=True)
    risk_level = Column(Text, nullable=True)
    parent_pressure = Column(Text, nullable=True)
    budget_level = Column(Text, nullable=True)
    confusion = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class ParentProfile(Base):
    __tablename__ = "parent_profiles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), nullable=False, unique=True, index=True)
    expectations = Column(Text, nullable=True)
    concerns = Column(Text, nullable=True)
    budget = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
