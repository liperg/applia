"""POST/GET /v1/documents, GET /v1/documents/{id} (T023, T025, T026)."""
import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session

from app.api.deps import get_current_firebase_uid
from app.database import get_db
from app.services.user_service import get_or_create_user
from app.services.storage_service import store_file
from app.services.document_service import create_document, list_documents_for_user, get_document_with_items
from app.models.document import DocumentStatus

router = APIRouter()


@router.post("/documents")
def upload_document(
    firebase_uid: Annotated[str, Depends(get_current_firebase_uid)],
    db: Annotated[Session, Depends(get_db)],
    file: UploadFile = File(...),
):
    """Accept PDF upload, store file, create document with status pending (AR-006: no reject by hash)."""
    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="PDF file required")
    content = file.file.read()
    if len(content) == 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Empty file")
    storage_key, sha256 = store_file(content, file.filename)
    user = get_or_create_user(db, firebase_uid)
    doc = create_document(db, user.id, storage_key, file.filename, sha256)
    return {
        "id": doc.id,
        "fileName": doc.file_name,
        "status": doc.status.value,
        "totalItems": None,
        "outOfRangeItems": None,
        "createdAt": doc.created_at.isoformat() + "Z",
    }


@router.get("/documents")
def list_documents(
    firebase_uid: Annotated[str, Depends(get_current_firebase_uid)],
    db: Annotated[Session, Depends(get_db)],
):
    """List user documents with status, totalItems, outOfRangeItems."""
    user = get_or_create_user(db, firebase_uid)
    rows = list_documents_for_user(db, user.id)
    items = []
    for doc, total_items, out_of_range_items in rows:
        items.append({
            "id": doc.id,
            "fileName": doc.file_name,
            "status": doc.status.value,
            "totalItems": total_items,
            "outOfRangeItems": out_of_range_items,
            "createdAt": doc.created_at.isoformat() + "Z",
        })
    return {"items": items}


@router.get("/documents/{document_id}")
def get_document(
    document_id: str,
    firebase_uid: Annotated[str, Depends(get_current_firebase_uid)],
    db: Annotated[Session, Depends(get_db)],
):
    """Get document detail with exam_items."""
    user = get_or_create_user(db, firebase_uid)
    doc = get_document_with_items(db, document_id, user.id)
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found")
    laboratory = None
    if doc.raw_json and isinstance(doc.raw_json, dict):
        laboratory = doc.raw_json.get("laboratory")
    exam_items = [
        {
            "code": ei.code,
            "name": ei.name,
            "date": ei.date.isoformat() if ei.date else None,
            "resultValue": ei.result_value,
            "unit": ei.unit,
            "referenceRange": ei.reference_range,
            "outOfRange": ei.out_of_range,
            "notes": ei.notes,
        }
        for ei in doc.exam_items
    ]
    return {
        "id": doc.id,
        "fileName": doc.file_name,
        "status": doc.status.value,
        "laboratory": laboratory,
        "examItems": exam_items,
    }
