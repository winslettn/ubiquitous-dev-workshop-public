package com.contoso.university.controller;

import com.contoso.university.domain.Department;
import com.contoso.university.domain.Instructor;
import com.contoso.university.repository.DepartmentRepository;
import com.contoso.university.repository.InstructorRepository;
import com.contoso.university.service.NotificationService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/departments")
public class DepartmentsController {
  private final DepartmentRepository departmentRepository;
  private final InstructorRepository instructorRepository;
  private final NotificationService notificationService;

  public DepartmentsController(
      DepartmentRepository departmentRepository,
      InstructorRepository instructorRepository,
      NotificationService notificationService) {
    this.departmentRepository = departmentRepository;
    this.instructorRepository = instructorRepository;
    this.notificationService = notificationService;
  }

  @GetMapping
  @PreAuthorize("isAuthenticated()")
  public String index(Model model) {
    model.addAttribute("departments", departmentRepository.findAll());
    return "departments/index";
  }

  @GetMapping("/{id}")
  @PreAuthorize("isAuthenticated()")
  public String details(@PathVariable int id, Model model) {
    model.addAttribute("department", departmentRepository.findById(id).orElseThrow());
    return "departments/details";
  }

  @GetMapping("/create")
  @PreAuthorize("hasRole('ADMINISTRATOR')")
  public String createForm(Model model) {
    model.addAttribute("department", new Department());
    return "departments/create";
  }

  @PostMapping("/create")
  @PreAuthorize("hasRole('ADMINISTRATOR')")
  public String create(
      @Valid @ModelAttribute Department department, BindingResult bindingResult, Model model) {
    resolveAdministrator(department);
    if (bindingResult.hasErrors()) {
      return "departments/create";
    }
    Department saved = departmentRepository.save(department);
    notificationService.sendNotification(
        "Department", String.valueOf(saved.getDepartmentId()), saved.getName(), "CREATE");
    return "redirect:/departments";
  }

  @GetMapping("/{id}/edit")
  @PreAuthorize("hasRole('ADMINISTRATOR')")
  public String editForm(@PathVariable int id, Model model) {
    model.addAttribute("department", departmentRepository.findById(id).orElseThrow());
    return "departments/edit";
  }

  @PostMapping("/{id}/edit")
  @PreAuthorize("hasRole('ADMINISTRATOR')")
  public String edit(
      @PathVariable int id,
      @Valid @ModelAttribute Department department,
      BindingResult bindingResult,
      Model model) {
    department.setDepartmentId(id);
    resolveAdministrator(department);
    if (bindingResult.hasErrors()) {
      return "departments/edit";
    }
    Department saved = departmentRepository.save(department);
    notificationService.sendNotification(
        "Department", String.valueOf(saved.getDepartmentId()), saved.getName(), "UPDATE");
    return "redirect:/departments";
  }

  @GetMapping("/{id}/delete")
  @PreAuthorize("hasRole('ADMINISTRATOR')")
  public String deleteForm(@PathVariable int id, Model model) {
    model.addAttribute("department", departmentRepository.findById(id).orElseThrow());
    return "departments/delete";
  }

  @PostMapping("/{id}/delete")
  @PreAuthorize("hasRole('ADMINISTRATOR')")
  public String delete(@PathVariable int id) {
    Department department = departmentRepository.findById(id).orElseThrow();
    String name = department.getName();
    departmentRepository.delete(department);
    notificationService.sendNotification("Department", String.valueOf(id), name, "DELETE");
    return "redirect:/departments";
  }

  @ModelAttribute("instructors")
  public java.util.List<Instructor> instructors() {
    return instructorRepository.findAll();
  }

  private void resolveAdministrator(Department department) {
    if (department.getAdministrator() == null || department.getAdministrator().getId() == null) {
      department.setAdministrator(null);
      return;
    }
    Instructor administrator =
        instructorRepository.findById(department.getAdministrator().getId()).orElse(null);
    department.setAdministrator(administrator);
  }
}
