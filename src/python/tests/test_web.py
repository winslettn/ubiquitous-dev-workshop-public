from fastapi.testclient import TestClient

from app.main import app, notifications, repository
from app.models import EntityOperation

client = TestClient(app)


def test_home_and_about_pages_render_seeded_content() -> None:
    home = client.get("/")
    about = client.get("/Home/About")

    assert home.status_code == 200
    assert "Contoso University" in home.text
    assert about.status_code == 200
    assert "2012-09-01" in about.text


def test_students_json_preserves_search_behavior() -> None:
    response = client.get(
        "/Students", params={"searchString": "Carson", "format": "json"}
    )

    assert response.status_code == 200
    assert response.json()["students"][0]["lastName"] == "Alexander"


def test_create_student_redirects_and_emits_notification() -> None:
    response = client.post(
        "/Students/Create",
        data={
            "LastName": "Doe",
            "FirstMidName": "Jane",
            "EnrollmentDate": "2026-01-15",
        },
        follow_redirects=False,
    )

    assert response.status_code == 303
    student = next(
        item for item in repository.students.values() if item.last_name == "Doe"
    )
    assert student.full_name == "Jane Doe"
    assert notifications.recent(1)[0].message == "Student 'Jane Doe' was created"


def test_api_notifications_returns_unread_messages() -> None:
    notifications.send("Course", "1050", "Chemistry", EntityOperation.UPDATE)

    response = client.get("/api/notifications")

    assert response.status_code == 200
    payload = response.json()
    assert payload["success"] is True
    assert payload["count"] >= 1
