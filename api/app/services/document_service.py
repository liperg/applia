"""Document create, list, get (for BFF endpoints)."""
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models import Document, ExamItem
from app.models.document import DocumentStatus


def create_document(
    db: Session,
    user_id: str,
    s3_key: str,
    file_name: str,
    sha256: str,
) -> Document:
    """Create document with status pending (AR-006: accept duplicate SHA-256, new record)."""
    doc = Document(
        user_id=user_id,
        s3_key=s3_key,
        file_name=file_name,
        sha256=sha256,
        status=DocumentStatus.pending,
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)
    return doc


def list_documents_for_user(db: Session, user_id: str) -> list[tuple[Document, int, int]]:
    """Return (document, total_items, out_of_range_count) for each document."""
    docs = db.query(Document).filter(Document.user_id == user_id).order_by(Document.created_at.desc()).all()
    result = []
    for doc in docs:
        total = db.query(ExamItem).filter(ExamItem.document_id == doc.id).count()
        out_of_range = db.query(ExamItem).filter(ExamItem.document_id == doc.id, ExamItem.out_of_range == True).count()
        result.append((doc, total, out_of_range))
    return result


def get_document_with_items(db: Session, document_id: str, user_id: str) -> Document | None:
    """Get document by id if owned by user; load exam_items via relationship."""
    doc = db.query(Document).filter(Document.id == document_id, Document.user_id == user_id).first()
    return doc
