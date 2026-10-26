from app.models import EntityOperation
from app.services import LocalNotificationService


def test_notification_receive_marks_item_read() -> None:
    service = LocalNotificationService()
    service.send("Student", "1", "Carson Alexander", EntityOperation.CREATE)

    notification = service.receive()

    assert notification is not None
    assert notification.message == "Student 'Carson Alexander' was created"
    assert notification.is_read is True
    assert service.receive() is None
