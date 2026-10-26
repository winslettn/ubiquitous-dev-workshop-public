from datetime import date

from app.repository import SchoolRepository


def test_seed_data_matches_contoso_baseline() -> None:
    repository = SchoolRepository()

    assert len(repository.students) == 8
    assert len(repository.instructors) == 5
    assert len(repository.departments) == 4
    assert len(repository.courses) == 7
    assert len(repository.enrollments) == 11
    assert repository.course_by_title("Chemistry").course_id == 1050


def test_student_search_sort_and_pagination() -> None:
    repository = SchoolRepository()

    result = repository.list_students(search="an", sort_order="name_desc", page_size=2)

    assert result["count"] == 4
    assert result["pages"] == 2
    assert [student.last_name for student in result["items"]] == ["Norman", "Li"]


def test_enrollment_date_statistics_are_grouped() -> None:
    repository = SchoolRepository()

    groups = repository.enrollment_groups()

    assert groups[0] == {"enrollment_date": date(2005, 9, 1), "student_count": 1}
    assert {"enrollment_date": date(2012, 9, 1), "student_count": 3} in groups
