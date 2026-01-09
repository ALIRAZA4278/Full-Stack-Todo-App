"""
SQLModel database models.
Per specs/database/schema.md
"""
from datetime import datetime, timezone
from typing import Optional
from sqlmodel import SQLModel, Field


class Task(SQLModel, table=True):
    """
    Task model representing a user's todo item.

    Security: Every task belongs to a user and can only be
    accessed by that user (enforced at API level).
    """
    __tablename__ = "tasks"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(
        index=True,
        nullable=False,
        description="Foreign key to users.id (Better Auth managed)"
    )
    title: str = Field(
        min_length=1,
        max_length=200,
        nullable=False,
        description="Task title (1-200 characters)"
    )
    description: Optional[str] = Field(
        default=None,
        max_length=1000,
        description="Task description (max 1000 characters)"
    )
    completed: bool = Field(
        default=False,
        nullable=False,
        description="Task completion status"
    )
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        nullable=False,
        description="Task creation timestamp (UTC)"
    )
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        nullable=False,
        description="Last update timestamp (UTC)"
    )
