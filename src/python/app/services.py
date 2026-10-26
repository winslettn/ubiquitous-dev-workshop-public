from __future__ import annotations

import shutil
from datetime import UTC, datetime
from pathlib import Path
from uuid import uuid4

from fastapi import UploadFile

from app.models import EntityOperation, Notification


class LocalNotificationService:
    def __init__(self) -> None:
        self._notifications: list[Notification] = []
        self._next_id = 1

    def send(
        self,
        entity_type: str,
        entity_id: str,
        entity_name: str,
        operation: EntityOperation,
        user_name: str = "Test Admin",
    ) -> Notification:
        verb = {
            EntityOperation.CREATE: "created",
            EntityOperation.UPDATE: "updated",
            EntityOperation.DELETE: "deleted",
            EntityOperation.READ: "read",
        }[operation]
        notification = Notification(
            id=self._next_id,
            entity_type=entity_type,
            entity_id=entity_id,
            operation=operation,
            message=f"{entity_type} '{entity_name}' was {verb}",
            created_by=user_name,
        )
        self._next_id += 1
        self._notifications.append(notification)
        return notification

    def receive(self) -> Notification | None:
        unread = next((item for item in self._notifications if not item.is_read), None)
        if unread is not None:
            self.mark_as_read(unread.id)
        return unread

    def recent(self, count: int = 10) -> list[Notification]:
        return sorted(
            self._notifications, key=lambda item: item.created_at, reverse=True
        )[:count]

    def mark_as_read(self, notification_id: int) -> None:
        notification = next(
            (item for item in self._notifications if item.id == notification_id), None
        )
        if notification is not None:
            notification.is_read = True
            notification.read_at = datetime.now(UTC)


class LocalFileStorageService:
    def __init__(self, upload_root: Path | None = None) -> None:
        self.upload_root = upload_root or Path("uploads")
        self.upload_root.mkdir(parents=True, exist_ok=True)

    def save(self, upload_file: UploadFile, course_id: int) -> str:
        extension = Path(upload_file.filename or "").suffix
        filename = f"course_{course_id}_{uuid4().hex}{extension}"
        destination = self.upload_root / filename
        with destination.open("wb") as file:
            shutil.copyfileobj(upload_file.file, file)
        return f"/uploads/{filename}"

    def delete(self, file_url: str | None) -> bool:
        if not file_url:
            return False
        path = self.upload_root / Path(file_url).name
        if not path.exists():
            return False
        path.unlink()
        return True
