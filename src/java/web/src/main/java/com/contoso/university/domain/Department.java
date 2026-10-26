package com.contoso.university.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Version;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Department {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer departmentId;

  @NotBlank
  @Size(min = 3, max = 50)
  private String name;

  @NotNull
  @DecimalMin("0.0")
  @Column(precision = 18, scale = 2)
  private BigDecimal budget;

  @NotNull private LocalDate startDate;

  @ManyToOne(fetch = FetchType.LAZY)
  private Instructor administrator;

  @Version private Long rowVersion;

  @OneToMany(mappedBy = "department")
  private List<Course> courses = new ArrayList<>();

  public Integer getDepartmentId() {
    return departmentId;
  }

  public void setDepartmentId(Integer departmentId) {
    this.departmentId = departmentId;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public BigDecimal getBudget() {
    return budget;
  }

  public void setBudget(BigDecimal budget) {
    this.budget = budget;
  }

  public LocalDate getStartDate() {
    return startDate;
  }

  public void setStartDate(LocalDate startDate) {
    this.startDate = startDate;
  }

  public Instructor getAdministrator() {
    return administrator;
  }

  public void setAdministrator(Instructor administrator) {
    this.administrator = administrator;
  }

  public Long getRowVersion() {
    return rowVersion;
  }

  public void setRowVersion(Long rowVersion) {
    this.rowVersion = rowVersion;
  }

  public List<Course> getCourses() {
    return courses;
  }

  public void setCourses(List<Course> courses) {
    this.courses = courses;
  }
}
