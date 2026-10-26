from __future__ import annotations

from dataclasses import asdict
from datetime import date
from math import ceil

from app.models import (
    Course,
    Department,
    Enrollment,
    Grade,
    Instructor,
    OfficeAssignment,
    Student,
)


def _parse_date(value: str) -> date:
    return date.fromisoformat(value)


class SchoolRepository:
    def __init__(self) -> None:
        self.students: dict[int, Student] = {}
        self.instructors: dict[int, Instructor] = {}
        self.departments: dict[int, Department] = {}
        self.courses: dict[int, Course] = {}
        self.enrollments: dict[int, Enrollment] = {}
        self._next_person_id = 1
        self._next_department_id = 1
        self._next_enrollment_id = 1
        self.seed()

    def seed(self) -> None:
        if self.students:
            return

        for first, last, enrolled in [
            ("Carson", "Alexander", "2010-09-01"),
            ("Meredith", "Alonso", "2012-09-01"),
            ("Arturo", "Anand", "2013-09-01"),
            ("Gytis", "Barzdukas", "2012-09-01"),
            ("Yan", "Li", "2012-09-01"),
            ("Peggy", "Justice", "2011-09-01"),
            ("Laura", "Norman", "2013-09-01"),
            ("Nino", "Olivetto", "2005-09-01"),
        ]:
            self.add_student(first, last, _parse_date(enrolled))

        for first, last, hired in [
            ("Kim", "Abercrombie", "1995-03-11"),
            ("Fadi", "Fakhouri", "2002-07-06"),
            ("Roger", "Harui", "1998-07-01"),
            ("Candace", "Kapoor", "2001-01-15"),
            ("Roger", "Zheng", "2004-02-12"),
        ]:
            self.add_instructor(first, last, _parse_date(hired))

        instructor_by_last = {i.last_name: i for i in self.instructors.values()}
        for name, budget, started, admin_last in [
            ("English", 350000, "2007-09-01", "Abercrombie"),
            ("Mathematics", 100000, "2007-09-01", "Fakhouri"),
            ("Engineering", 350000, "2007-09-01", "Harui"),
            ("Economics", 100000, "2007-09-01", "Kapoor"),
        ]:
            self.add_department(
                name,
                budget,
                _parse_date(started),
                instructor_by_last[admin_last].id,
            )

        department_by_name = {d.name: d for d in self.departments.values()}
        for course_id, title, credits, department in [
            (1050, "Chemistry", 3, "Engineering"),
            (4022, "Microeconomics", 3, "Economics"),
            (4041, "Macroeconomics", 3, "Economics"),
            (1045, "Calculus", 4, "Mathematics"),
            (3141, "Trigonometry", 4, "Mathematics"),
            (2021, "Composition", 3, "English"),
            (2042, "Literature", 4, "English"),
        ]:
            self.add_course(
                course_id,
                title,
                credits,
                department_by_name[department].department_id,
            )

        for last_name, location in [
            ("Fakhouri", "Smith 17"),
            ("Harui", "Gowan 27"),
            ("Kapoor", "Thompson 304"),
        ]:
            instructor = instructor_by_last[last_name]
            instructor.office_assignment = OfficeAssignment(instructor.id, location)

        for title, last_name in [
            ("Chemistry", "Kapoor"),
            ("Chemistry", "Harui"),
            ("Microeconomics", "Zheng"),
            ("Macroeconomics", "Zheng"),
            ("Calculus", "Fakhouri"),
            ("Trigonometry", "Harui"),
            ("Composition", "Abercrombie"),
            ("Literature", "Abercrombie"),
        ]:
            self.assign_course(
                instructor_by_last[last_name].id,
                self.course_by_title(title).course_id,
            )

        student_by_last = {s.last_name: s for s in self.students.values()}
        for last_name, title, grade in [
            ("Alexander", "Chemistry", Grade.A),
            ("Alexander", "Microeconomics", Grade.C),
            ("Alexander", "Macroeconomics", Grade.B),
            ("Alonso", "Calculus", Grade.B),
            ("Alonso", "Trigonometry", Grade.B),
            ("Alonso", "Composition", Grade.B),
            ("Anand", "Chemistry", None),
            ("Anand", "Microeconomics", Grade.B),
            ("Barzdukas", "Chemistry", Grade.B),
            ("Li", "Composition", Grade.B),
            ("Justice", "Literature", Grade.B),
        ]:
            self.enroll(
                student_by_last[last_name].id,
                self.course_by_title(title).course_id,
                grade,
            )

    def add_student(self, first: str, last: str, enrollment_date: date) -> Student:
        student = Student(self._next_person_id, last, first, enrollment_date)
        self._next_person_id += 1
        self.students[student.id] = student
        return student

    def add_instructor(self, first: str, last: str, hire_date: date) -> Instructor:
        instructor = Instructor(self._next_person_id, last, first, hire_date)
        self._next_person_id += 1
        self.instructors[instructor.id] = instructor
        return instructor

    def add_department(
        self, name: str, budget: float, start_date: date, instructor_id: int | None
    ) -> Department:
        department = Department(
            self._next_department_id, name, budget, start_date, instructor_id
        )
        self._next_department_id += 1
        self.departments[department.department_id] = department
        return department

    def add_course(
        self, course_id: int, title: str, credits: int, department_id: int
    ) -> Course:
        course = Course(course_id, title, credits, department_id)
        self.courses[course.course_id] = course
        return course

    def assign_course(self, instructor_id: int, course_id: int) -> None:
        instructor = self.instructors[instructor_id]
        if course_id not in instructor.course_ids:
            instructor.course_ids.append(course_id)

    def enroll(
        self, student_id: int, course_id: int, grade: Grade | None = None
    ) -> Enrollment:
        enrollment = Enrollment(self._next_enrollment_id, course_id, student_id, grade)
        self._next_enrollment_id += 1
        self.enrollments[enrollment.enrollment_id] = enrollment
        self.students[student_id].enrollments.append(enrollment)
        return enrollment

    def course_by_title(self, title: str) -> Course:
        return next(course for course in self.courses.values() if course.title == title)

    def list_students(
        self,
        search: str | None = None,
        sort_order: str | None = None,
        page_number: int = 1,
        page_size: int = 10,
    ) -> dict[str, object]:
        students = list(self.students.values())
        if search:
            query = search.lower()
            students = [
                item
                for item in students
                if query in item.last_name.lower()
                or query in item.first_mid_name.lower()
            ]
        match sort_order:
            case "name_desc":
                students.sort(key=lambda item: item.last_name, reverse=True)
            case "Date":
                students.sort(key=lambda item: item.enrollment_date)
            case "date_desc":
                students.sort(key=lambda item: item.enrollment_date, reverse=True)
            case _:
                students.sort(key=lambda item: item.last_name)
        page_count = max(1, ceil(len(students) / page_size))
        page_number = min(max(page_number, 1), page_count)
        start = (page_number - 1) * page_size
        return {
            "items": students[start : start + page_size],
            "page": page_number,
            "pages": page_count,
            "count": len(students),
        }

    def enrollment_groups(self) -> list[dict[str, object]]:
        groups: dict[date, int] = {}
        for student in self.students.values():
            groups[student.enrollment_date] = groups.get(student.enrollment_date, 0) + 1
        return [
            {"enrollment_date": key, "student_count": value}
            for key, value in sorted(groups.items())
        ]

    def snapshot(self) -> dict[str, list[dict[str, object]]]:
        return {
            "students": [asdict(item) for item in self.students.values()],
            "instructors": [asdict(item) for item in self.instructors.values()],
            "departments": [asdict(item) for item in self.departments.values()],
            "courses": [asdict(item) for item in self.courses.values()],
            "enrollments": [asdict(item) for item in self.enrollments.values()],
        }
