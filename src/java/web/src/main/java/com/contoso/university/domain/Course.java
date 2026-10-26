package com.contoso.university.domain;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Course {
  @Id private Integer courseId;

  @NotBlank
  @Size(min = 3, max = 50)
  private String title;

  @NotNull
  @Min(0)
  @Max(5)
  private Integer credits;

  @ManyToOne(optional = false)
  private Department department;

  @Size(max = 255)
  private String teachingMaterialImagePath;

  @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<Enrollment> enrollments = new ArrayList<>();

  @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<CourseAssignment> courseAssignments = new ArrayList<>();

  public Integer getCourseId() {
    return courseId;
  }

  public void setCourseId(Integer courseId) {
    this.courseId = courseId;
  }

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public Integer getCredits() {
    return credits;
  }

  public void setCredits(Integer credits) {
    this.credits = credits;
  }

  public Department getDepartment() {
    return department;
  }

  public void setDepartment(Department department) {
    this.department = department;
  }

  public String getTeachingMaterialImagePath() {
    return teachingMaterialImagePath;
  }

  public void setTeachingMaterialImagePath(String teachingMaterialImagePath) {
    this.teachingMaterialImagePath = teachingMaterialImagePath;
  }

  public List<Enrollment> getEnrollments() {
    return enrollments;
  }

  public void setEnrollments(List<Enrollment> enrollments) {
    this.enrollments = enrollments;
  }

  public List<CourseAssignment> getCourseAssignments() {
    return courseAssignments;
  }

  public void setCourseAssignments(List<CourseAssignment> courseAssignments) {
    this.courseAssignments = courseAssignments;
  }
}
