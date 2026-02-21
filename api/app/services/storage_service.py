"""
Store uploaded PDF: S3 when configured, else local fallback (dev).
Returns (storage_key, sha256_hex).
"""
import hashlib
import os
import uuid
from pathlib import Path

# Optional: add boto3 to requirements when using real S3
# import boto3

UPLOAD_DIR = Path(__file__).resolve().parent.parent.parent / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


def _compute_sha256(content: bytes) -> str:
    return hashlib.sha256(content).hexdigest()


def store_file(content: bytes, file_name: str) -> tuple[str, str]:
    """
    Store file and return (storage_key, sha256_hex).
    Local dev: store under api/uploads/{uuid}-{sanitized_name}, key = relative path.
    """
    sha256_hex = _compute_sha256(content)
    safe_name = "".join(c for c in file_name if c.isalnum() or c in ".-_")[:200] or "file"
    unique_name = f"{uuid.uuid4().hex[:12]}-{safe_name}"
    local_path = UPLOAD_DIR / unique_name
    local_path.write_bytes(content)
    # Storage key: for S3 would be e.g. "documents/{user_id}/{key}"; for local we use relative path
    storage_key = f"uploads/{unique_name}"
    return storage_key, sha256_hex
