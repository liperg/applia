"""User get-or-create by Firebase UID (for GET /v1/me)."""
from sqlalchemy.orm import Session

from app.models import User


def get_or_create_user(db: Session, firebase_uid: str, email: str | None = None, display_name: str | None = None, avatar_url: str | None = None) -> User:
    user = db.query(User).filter(User.firebase_uid == firebase_uid).first()
    if user:
        if display_name is not None:
            user.display_name = display_name
        if avatar_url is not None:
            user.avatar_url = avatar_url
        if email is not None:
            user.email = email
        db.commit()
        db.refresh(user)
        return user
    user = User(
        firebase_uid=firebase_uid,
        email=email,
        display_name=display_name,
        avatar_url=avatar_url,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
