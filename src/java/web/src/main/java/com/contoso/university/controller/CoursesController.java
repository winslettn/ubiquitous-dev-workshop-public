package com.contoso.university.controller;

import com.contoso.university.domain.Course;
import com.contoso.university.domain.Department;
import com.contoso.university.repository.CourseRepository;
import com.contoso.university.repository.DepartmentRepository;
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
@RequestMapping("/courses")
public class CoursesController {
  private final CourseRepository courseRepository;
  private final DepartmentRepository departmentRepository;
  private final NotificationService notificationService;

  public CoursesController(
      CourseRepository courseRepository,
      DepartmentRepository departmentRepository,
      NotificationService notificationService) {
    this.courseRepository = courseRepository;
    this.departmentRepository = departmentRepository;
    this.notificationService = notificationService;
  }

  @GetMapping
  public String index(Model model) {
    model.addAttribute("courses", courseRepository.findAll());
    return "courses/index";
  }

  @GetMapping("/{id}")
  public String details(@PathVariable int id, Model model) {
    model.addAttribute("course", courseRepository.findById(id).orElseThrow());
    return "courses/details";
  }

  @GetMapping("/create")
  @PreAuthorize("hasRole('ADMIN')")
  public String createForm(Model model) {
    model.addAttribute("course", new Course());
    return "courses/create";
  }

  @PostMapping("/create")
  @PreAuthorize("hasRole('ADMIN')")
  public String create(
      @Valid @ModelAttribute Course course, BindingResult bindingResult, Model model) {
    resolveDepartment(course, bindingResult);
    if (bindingResult.hasErrors()) {
      return "courses/create";
    }
    Course saved = courseRepository.save(course);
    notificationService.sendNotification(
        "Course", String.valueOf(saved.getCourseId()), saved.getTitle(), "CREATE");
    return "redirect:/courses";
  }

  @GetMapping("/{id}/edit")
  @PreAuthorize("hasRole('ADMIN')")
  public String editForm(@PathVariable int id, Model model) {
    model.addAttribute("course", courseRepository.findById(id).orElseThrow());
    return "courses/edit";
  }

  @PostMapping("/{id}/edit")
  @PreAuthorize("hasRole('ADMIN')")
  public String edit(
      @PathVariable int id,
      @Valid @ModelAttribute Course course,
      BindingResult bindingResult,
      Model model) {
    course.setCourseId(id);
    resolveDepartment(course, bindingResult);
    if (bindingResult.hasErrors()) {
      return "courses/edit";
    }
    Course saved = courseRepository.save(course);
    notificationService.sendNotification(
        "Course", String.valueOf(saved.getCourseId()), saved.getTitle(), "UPDATE");
    return "redirect:/courses";
  }

  @GetMapping("/{id}/delete")
  @PreAuthorize("hasRole('ADMIN')")
  public String deleteForm(@PathVariable int id, Model model) {
    model.addAttribute("course", courseRepository.findById(id).orElseThrow());
    return "courses/delete";
  }

  @PostMapping("/{id}/delete")
  @PreAuthorize("hasRole('ADMIN')")
  public String delete(@PathVariable int id) {
    Course course = courseRepository.findById(id).orElseThrow();
    String title = course.getTitle();
    courseRepository.delete(course);
    notificationService.sendNotification("Course", String.valueOf(id), title, "DELETE");
    return "redirect:/courses";
  }

  @ModelAttribute("departments")
  public java.util.List<Department> departments() {
    return departmentRepository.findAll();
  }

  private void resolveDepartment(Course course, BindingResult bindingResult) {
    if (course.getDepartment() == null || course.getDepartment().getDepartmentId() == null) {
      bindingResult.rejectValue("department", "required", "Department is required.");
      return;
    }
    Department department =
        departmentRepository.findById(course.getDepartment().getDepartmentId()).orElse(null);
    if (department == null) {
      bindingResult.rejectValue("department", "invalid", "Selected department does not exist.");
      return;
    }
    course.setDepartment(department);
  }
}
