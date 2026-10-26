package com.contoso.university.controller;

import com.contoso.university.domain.Student;
import com.contoso.university.repository.StudentRepository;
import com.contoso.university.service.NotificationService;
import jakarta.validation.Valid;
import java.time.LocalDate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@RequestMapping("/students")
public class StudentsController {
  private final StudentRepository studentRepository;
  private final NotificationService notificationService;

  public StudentsController(
      StudentRepository studentRepository, NotificationService notificationService) {
    this.studentRepository = studentRepository;
    this.notificationService = notificationService;
  }

  @GetMapping
  @PreAuthorize("hasAnyRole('ADMIN','TEACHER')")
  public String index(
      @RequestParam(defaultValue = "") String sortOrder,
      @RequestParam(required = false) String currentFilter,
      @RequestParam(required = false) String searchString,
      @RequestParam(defaultValue = "1") int pageNumber,
      Model model) {
    String effectiveSearch =
        searchString != null ? searchString : (currentFilter == null ? "" : currentFilter);
    if (searchString != null) {
      pageNumber = 1;
    }

    Sort sort =
        switch (sortOrder) {
          case "name_desc" -> Sort.by("lastName").descending();
          case "Date" -> Sort.by("enrollmentDate").ascending();
          case "date_desc" -> Sort.by("enrollmentDate").descending();
          default -> Sort.by("lastName").ascending();
        };

    Page<Student> students =
        effectiveSearch.isBlank()
            ? studentRepository.findAll(PageRequest.of(Math.max(pageNumber - 1, 0), 10, sort))
            : studentRepository
                .findByLastNameContainingIgnoreCaseOrFirstMidNameContainingIgnoreCase(
                    effectiveSearch,
                    effectiveSearch,
                    PageRequest.of(Math.max(pageNumber - 1, 0), 10, sort));

    model.addAttribute("studentsPage", students);
    model.addAttribute("currentSort", sortOrder);
    model.addAttribute("nameSortParm", sortOrder.isBlank() ? "name_desc" : "");
    model.addAttribute("dateSortParm", "Date".equals(sortOrder) ? "date_desc" : "Date");
    model.addAttribute("currentFilter", effectiveSearch);
    return "students/index";
  }

  @GetMapping("/{id}")
  @PreAuthorize("hasAnyRole('ADMIN','TEACHER')")
  public String details(@PathVariable int id, Model model) {
    model.addAttribute("student", studentRepository.findById(id).orElseThrow());
    return "students/details";
  }

  @GetMapping("/create")
  @PreAuthorize("hasRole('ADMIN')")
  public String createForm(Model model) {
    Student student = new Student();
    student.setEnrollmentDate(LocalDate.now());
    model.addAttribute("student", student);
    return "students/create";
  }

  @PostMapping("/create")
  @PreAuthorize("hasRole('ADMIN')")
  public String create(@Valid @ModelAttribute Student student, BindingResult bindingResult) {
    if (student.getEnrollmentDate() != null
        && (student.getEnrollmentDate().isBefore(LocalDate.of(1753, 1, 1))
            || student.getEnrollmentDate().isAfter(LocalDate.of(9999, 12, 31)))) {
      bindingResult.rejectValue(
          "enrollmentDate", "range", "Enrollment date must be between 1753 and 9999.");
    }
    if (bindingResult.hasErrors()) {
      return "students/create";
    }

    Student saved = studentRepository.save(student);
    notificationService.sendNotification(
        "Student", String.valueOf(saved.getId()), saved.getFullName(), "CREATE");
    return "redirect:/students";
  }

  @GetMapping("/{id}/edit")
  @PreAuthorize("hasRole('ADMIN')")
  public String editForm(@PathVariable int id, Model model) {
    model.addAttribute("student", studentRepository.findById(id).orElseThrow());
    return "students/edit";
  }

  @PostMapping("/{id}/edit")
  @PreAuthorize("hasRole('ADMIN')")
  public String edit(
      @PathVariable int id, @Valid @ModelAttribute Student student, BindingResult bindingResult) {
    if (bindingResult.hasErrors()) {
      return "students/edit";
    }
    student.setId(id);
    Student saved = studentRepository.save(student);
    notificationService.sendNotification(
        "Student", String.valueOf(saved.getId()), saved.getFullName(), "UPDATE");
    return "redirect:/students";
  }

  @GetMapping("/{id}/delete")
  @PreAuthorize("hasRole('ADMIN')")
  public String deleteForm(@PathVariable int id, Model model) {
    model.addAttribute("student", studentRepository.findById(id).orElseThrow());
    return "students/delete";
  }

  @PostMapping("/{id}/delete")
  @PreAuthorize("hasRole('ADMIN')")
  public String delete(@PathVariable int id) {
    Student student = studentRepository.findById(id).orElseThrow();
    String name = student.getFullName();
    studentRepository.delete(student);
    notificationService.sendNotification("Student", String.valueOf(id), name, "DELETE");
    return "redirect:/students";
  }
}
