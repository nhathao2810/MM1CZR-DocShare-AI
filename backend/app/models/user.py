import uuid
from sqlalchemy import Column, String, DateTime, CheckConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(100), nullable=False)
    role = Column(
        String(20),
        CheckConstraint("role IN ('USER', 'ADMIN')", name="check_user_role"),
        nullable=False,
        default="USER"
    )
    status = Column(
        String(20),
        CheckConstraint("status IN ('ACTIVE', 'BANNED')", name="check_user_status"),
        nullable=False,
        default="ACTIVE"
    )
    avatar_url = Column(String(500), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
