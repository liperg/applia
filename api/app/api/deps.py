"""
Firebase ID token validation for protected endpoints (AR-005).
Validate Bearer token and return current user id (firebase_uid or local user id).
"""
from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

# TODO: integrate firebase_admin to verify ID tokens and resolve firebase_uid
# For MVP without Firebase Admin SDK, accept a placeholder and document the requirement.
security = HTTPBearer(auto_error=True)


async def get_current_firebase_uid(
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(security)],
) -> str:
    token = credentials.credentials
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid authorization token",
        )
    # Placeholder: in production, verify token with Firebase Admin SDK and return uid
    # For local dev/mock, accept any non-empty token and return a test uid
    return token if len(token) < 64 else "mock-firebase-uid"
