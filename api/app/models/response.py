import uuid
from datetime import datetime
from sqlalchemy import String, DateTime, Enum, ForeignKey
from sqlalchemy import JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
import enum

from .base import Base


class ResponsePhase(str, enum.Enum):
    discovery = "discovery"
    extraction = "extraction"


class Response(Base):
    __tablename__ = "responses"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    document_id: Mapped[str] = mapped_column(String(36), ForeignKey("documents.id"), nullable=False, index=True)
    phase: Mapped[ResponsePhase] = mapped_column(Enum(ResponsePhase), nullable=False)
    provider: Mapped[str] = mapped_column(String(32), default="openai")
    response_uuid: Mapped[str] = mapped_column(String(64), nullable=False)
    request_payload: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    response_payload: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.utcnow)

    document = relationship("Document", back_populates="responses")
