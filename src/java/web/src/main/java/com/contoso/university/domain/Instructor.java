package com.contoso.university.domain;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Instructor {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer id;

  @NotBlank
  @Size(max = 50)
  private String lastName;

  @NotBlank
  @Size(max = 50)
  private String firstMidName;

  @NotNull private LocalDate hireDate;

  @OneToMany(mappedBy = "instructor", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<CourseAssignment> courseAssignments = new ArrayList<>();

  @OneToOne(mappedBy = "instructor", cascade = CascadeType.ALL, orphanRemoval = true)
  private OfficeAssignment officeAssignment;

  public Integer getId() {
    return id;
  }

  public void setId(Integer id) {
    this.id = id;
  }

  public String getLastName() {
    return lastName;
  }

  public void setLastName(String lastName) {
    this.lastName = lastName;
  }

  public String getFirstMidName() {
    return firstMidName;
  }

  public void setFirstMidName(String firstMidName) {
    this.firstMidName = firstMidName;
  }

  public LocalDate getHireDate() {
    return hireDate;
  }

  public void setHireDate(LocalDate hireDate) {
    this.hireDate = hireDate;
  }

  public List<CourseAssignment> getCourseAssignments() {
    return courseAssignments;
  }

  public void setCourseAssignments(List<CourseAssignment> courseAssignments) {
    this.courseAssignments = courseAssignments;
  }

  public OfficeAssignment getOfficeAssignment() {
    return officeAssignment;
  }

  public void setOfficeAssignment(OfficeAssignment officeAssignment) {
    this.officeAssignment = officeAssignment;
  }

  public String getFullName() {
    return lastName + ", " + firstMidName;
  }
}
