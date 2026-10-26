package com.contoso.university.config;

import com.contoso.university.domain.Course;
import com.contoso.university.domain.CourseAssignment;
import com.contoso.university.domain.Department;
import com.contoso.university.domain.Enrollment;
import com.contoso.university.domain.Grade;
import com.contoso.university.domain.Instructor;
import com.contoso.university.domain.OfficeAssignment;
import com.contoso.university.domain.Student;
import com.contoso.university.repository.CourseRepository;
import com.contoso.university.repository.DepartmentRepository;
import com.contoso.university.repository.InstructorRepository;
import com.contoso.university.repository.StudentRepository;
import jakarta.transaction.Transactional;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {
  private final StudentRepository studentRepository;
  private final InstructorRepository instructorRepository;
  private final DepartmentRepository departmentRepository;
  private final CourseRepository courseRepository;

  public DataInitializer(
      StudentRepository studentRepository,
      InstructorRepository instructorRepository,
      DepartmentRepository departmentRepository,
      CourseRepository courseRepository) {
    this.studentRepository = studentRepository;
    this.instructorRepository = instructorRepository;
    this.departmentRepository = departmentRepository;
    this.courseRepository = courseRepository;
  }

  @Override
  @Transactional
  public void run(String... args) {
    if (studentRepository.count() > 0) {
      return;
    }

    Student alexander = student("Carson", "Alexander", "2010-09-01");
    Student alonso = student("Meredith", "Alonso", "2012-09-01");
    Student anand = student("Arturo", "Anand", "2013-09-01");
    Student barzdukas = student("Gytis", "Barzdukas", "2012-09-01");
    Student li = student("Yan", "Li", "2012-09-01");
    Student justice = student("Peggy", "Justice", "2011-09-01");
    Student norman = student("Laura", "Norman", "2013-09-01");
    Student olivetto = student("Nino", "Olivetto", "2005-09-01");
    studentRepository.saveAll(
        List.of(alexander, alonso, anand, barzdukas, li, justice, norman, olivetto));

    Instructor abercrombie = instructor("Kim", "Abercrombie", "1995-03-11");
    Instructor fakhouri = instructor("Fadi", "Fakhouri", "2002-07-06");
    Instructor harui = instructor("Roger", "Harui", "1998-07-01");
    Instructor kapoor = instructor("Candace", "Kapoor", "2001-01-15");
    Instructor zheng = instructor("Roger", "Zheng", "2004-02-12");
    instructorRepository.saveAll(List.of(abercrombie, fakhouri, harui, kapoor, zheng));

    OfficeAssignment office1 = new OfficeAssignment();
    office1.setInstructor(fakhouri);
    office1.setLocation("Smith 17");
    fakhouri.setOfficeAssignment(office1);

    OfficeAssignment office2 = new OfficeAssignment();
    office2.setInstructor(harui);
    office2.setLocation("Gowan 27");
    harui.setOfficeAssignment(office2);

    OfficeAssignment office3 = new OfficeAssignment();
    office3.setInstructor(kapoor);
    office3.setLocation("Thompson 304");
    kapoor.setOfficeAssignment(office3);
    instructorRepository.saveAll(List.of(fakhouri, harui, kapoor));

    Department english = department("English", "350000", "2007-09-01", abercrombie);
    Department math = department("Mathematics", "100000", "2007-09-01", fakhouri);
    Department engineering = department("Engineering", "350000", "2007-09-01", harui);
    Department economics = department("Economics", "100000", "2007-09-01", kapoor);
    departmentRepository.saveAll(List.of(english, math, engineering, economics));

    Course chemistry = course(1050, "Chemistry", 3, engineering);
    Course microeconomics = course(4022, "Microeconomics", 3, economics);
    Course macroeconomics = course(4041, "Macroeconomics", 3, economics);
    Course calculus = course(1045, "Calculus", 4, math);
    Course trigonometry = course(3141, "Trigonometry", 4, math);
    Course composition = course(2021, "Composition", 3, english);
    Course literature = course(2042, "Literature", 4, english);
    courseRepository.saveAll(
        List.of(
            chemistry,
            microeconomics,
            macroeconomics,
            calculus,
            trigonometry,
            composition,
            literature));

    assign(kapoor, chemistry);
    assign(harui, chemistry);
    assign(zheng, microeconomics);
    assign(zheng, macroeconomics);
    assign(fakhouri, calculus);
    assign(harui, trigonometry);
    assign(abercrombie, composition);
    assign(abercrombie, literature);
    instructorRepository.saveAll(List.of(abercrombie, fakhouri, harui, kapoor, zheng));

    enroll(alexander, chemistry, Grade.A);
    enroll(alexander, microeconomics, Grade.C);
    enroll(alexander, macroeconomics, Grade.B);
    enroll(alonso, calculus, Grade.B);
    enroll(alonso, trigonometry, Grade.B);
    enroll(alonso, composition, Grade.B);
    enroll(anand, chemistry, null);
    enroll(anand, microeconomics, Grade.B);
    enroll(barzdukas, chemistry, Grade.B);
    enroll(li, composition, Grade.B);
    enroll(justice, literature, Grade.B);
    studentRepository.saveAll(List.of(alexander, alonso, anand, barzdukas, li, justice));
  }

  private Student student(String first, String last, String date) {
    Student s = new Student();
    s.setFirstMidName(first);
    s.setLastName(last);
    s.setEnrollmentDate(LocalDate.parse(date));
    return s;
  }

  private Instructor instructor(String first, String last, String date) {
    Instructor i = new Instructor();
    i.setFirstMidName(first);
    i.setLastName(last);
    i.setHireDate(LocalDate.parse(date));
    return i;
  }

  private Department department(String name, String budget, String start, Instructor admin) {
    Department d = new Department();
    d.setName(name);
    d.setBudget(new BigDecimal(budget));
    d.setStartDate(LocalDate.parse(start));
    d.setAdministrator(admin);
    return d;
  }

  private Course course(int id, String title, int credits, Department dept) {
    Course c = new Course();
    c.setCourseId(id);
    c.setTitle(title);
    c.setCredits(credits);
    c.setDepartment(dept);
    return c;
  }

  private void assign(Instructor instructor, Course course) {
    CourseAssignment assignment = new CourseAssignment();
    assignment.setInstructor(instructor);
    assignment.setCourse(course);
    instructor.getCourseAssignments().add(assignment);
    course.getCourseAssignments().add(assignment);
  }

  private void enroll(Student student, Course course, Grade grade) {
    Enrollment e = new Enrollment();
    e.setStudent(student);
    e.setCourse(course);
    e.setGrade(grade);
    student.getEnrollments().add(e);
    course.getEnrollments().add(e);
  }
}
