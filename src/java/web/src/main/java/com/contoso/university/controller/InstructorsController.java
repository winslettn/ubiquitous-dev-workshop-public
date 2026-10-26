package com.contoso.university.controller;

import com.contoso.university.domain.Course;
import com.contoso.university.domain.CourseAssignment;
import com.contoso.university.domain.Department;
import com.contoso.university.domain.Instructor;
import com.contoso.university.domain.OfficeAssignment;
import com.contoso.university.repository.CourseRepository;
import com.contoso.university.repository.DepartmentRepository;
import com.contoso.university.repository.InstructorRepository;
import com.contoso.university.service.NotificationService;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Set;
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
@RequestMapping("/instructors")
public class InstructorsController {
  private final InstructorRepository instructorRepository;
  private final CourseRepository courseRepository;
  private final DepartmentRepository departmentRepository;
  private final NotificationService notificationService;

  public InstructorsController(
      InstructorRepository instructorRepository,
      CourseRepository courseRepository,
      DepartmentRepository departmentRepository,
      NotificationService notificationService) {
    this.instructorRepository = instructorRepository;
    this.courseRepository = courseRepository;
    this.departmentRepository = departmentRepository;
    this.notificationService = notificationService;
  }

  @GetMapping
  public String index(
      @RequestParam(required = false) Integer id,
      @RequestParam(required = false) Integer courseId,
      Model model) {
    List<Instructor> instructors =
        instructorRepository.findAll().stream()
            .sorted(Comparator.comparing(Instructor::getLastName))
            .toList();
    model.addAttribute("instructors", instructors);
    model.addAttribute("selectedInstructorId", id);
    model.addAttribute("selectedCourseId", courseId);

    if (id != null) {
      Instructor instructor =
          instructors.stream().filter(i -> i.getId().equals(id)).findFirst().orElse(null);
      if (instructor != null) {
        List<Course> courses =
            instructor.getCourseAssignments().stream().map(CourseAssignment::getCourse).toList();
        model.addAttribute("courses", courses);
        if (courseId != null) {
          Course course =
              courses.stream()
                  .filter(c -> c.getCourseId().equals(courseId))
                  .findFirst()
                  .orElse(null);
          model.addAttribute("enrollments", course == null ? List.of() : course.getEnrollments());
        }
      }
    }
    return "instructors/index";
  }

  @GetMapping("/{id}")
  public String details(@PathVariable int id, Model model) {
    model.addAttribute("instructor", instructorRepository.findById(id).orElseThrow());
    return "instructors/details";
  }

  @GetMapping("/create")
  @PreAuthorize("hasRole('ADMIN')")
  public String createForm(Model model) {
    model.addAttribute("instructor", new Instructor());
    model.addAttribute("selectedCourses", List.<Integer>of());
    return "instructors/create";
  }

  @PostMapping("/create")
  @PreAuthorize("hasRole('ADMIN')")
  public String create(
      @ModelAttribute Instructor instructor,
      BindingResult bindingResult,
      @RequestParam(name = "selectedCourses", required = false) List<Integer> selectedCourses,
      @RequestParam(name = "officeLocation", required = false) String officeLocation,
      Model model) {
    if (bindingResult.hasErrors()) {
      model.addAttribute("selectedCourses", selectedCourses == null ? List.of() : selectedCourses);
      return "instructors/create";
    }
    applyOfficeAssignment(instructor, officeLocation);
    applyCourseAssignments(instructor, selectedCourses);
    Instructor saved = instructorRepository.save(instructor);
    notificationService.sendNotification(
        "Instructor", String.valueOf(saved.getId()), saved.getFullName(), "CREATE");
    return "redirect:/instructors";
  }

  @GetMapping("/{id}/edit")
  @PreAuthorize("hasRole('ADMIN')")
  public String editForm(@PathVariable int id, Model model) {
    Instructor instructor = instructorRepository.findById(id).orElseThrow();
    model.addAttribute("instructor", instructor);
    model.addAttribute(
        "selectedCourses",
        instructor.getCourseAssignments().stream().map(a -> a.getCourse().getCourseId()).toList());
    model.addAttribute(
        "officeLocation",
        instructor.getOfficeAssignment() == null
            ? ""
            : instructor.getOfficeAssignment().getLocation());
    return "instructors/edit";
  }

  @PostMapping("/{id}/edit")
  @PreAuthorize("hasRole('ADMIN')")
  public String edit(
      @PathVariable int id,
      @ModelAttribute Instructor form,
      BindingResult bindingResult,
      @RequestParam(name = "selectedCourses", required = false) List<Integer> selectedCourses,
      @RequestParam(name = "officeLocation", required = false) String officeLocation,
      Model model) {
    if (bindingResult.hasErrors()) {
      model.addAttribute("selectedCourses", selectedCourses == null ? List.of() : selectedCourses);
      return "instructors/edit";
    }

    Instructor existing = instructorRepository.findById(id).orElseThrow();
    existing.setLastName(form.getLastName());
    existing.setFirstMidName(form.getFirstMidName());
    existing.setHireDate(form.getHireDate());
    applyOfficeAssignment(existing, officeLocation);
    applyCourseAssignments(existing, selectedCourses);
    Instructor saved = instructorRepository.save(existing);
    notificationService.sendNotification(
        "Instructor", String.valueOf(saved.getId()), saved.getFullName(), "UPDATE");
    return "redirect:/instructors";
  }

  @GetMapping("/{id}/delete")
  @PreAuthorize("hasRole('ADMIN')")
  public String deleteForm(@PathVariable int id, Model model) {
    model.addAttribute("instructor", instructorRepository.findById(id).orElseThrow());
    return "instructors/delete";
  }

  @PostMapping("/{id}/delete")
  @PreAuthorize("hasRole('ADMIN')")
  public String delete(@PathVariable int id) {
    Instructor instructor = instructorRepository.findById(id).orElseThrow();
    String name = instructor.getFullName();
    for (Department department : departmentRepository.findAll()) {
      if (department.getAdministrator() != null
          && department.getAdministrator().getId().equals(id)) {
        department.setAdministrator(null);
      }
    }
    instructorRepository.delete(instructor);
    notificationService.sendNotification("Instructor", String.valueOf(id), name, "DELETE");
    return "redirect:/instructors";
  }

  @ModelAttribute("allCourses")
  public List<Course> allCourses() {
    return courseRepository.findAll();
  }

  private void applyCourseAssignments(Instructor instructor, List<Integer> selectedCourses) {
    Set<Integer> selected = selectedCourses == null ? Set.of() : Set.copyOf(selectedCourses);
    List<CourseAssignment> assignments = new ArrayList<>();
    for (Integer courseId : selected) {
      Course course = courseRepository.findById(courseId).orElse(null);
      if (course == null) {
        continue;
      }
      CourseAssignment assignment = new CourseAssignment();
      assignment.setInstructor(instructor);
      assignment.setCourse(course);
      assignments.add(assignment);
    }
    instructor.setCourseAssignments(assignments);
  }

  private void applyOfficeAssignment(Instructor instructor, String officeLocation) {
    if (officeLocation == null || officeLocation.isBlank()) {
      instructor.setOfficeAssignment(null);
      return;
    }
    OfficeAssignment office = instructor.getOfficeAssignment();
    if (office == null) {
      office = new OfficeAssignment();
      office.setInstructor(instructor);
    }
    office.setLocation(officeLocation);
    instructor.setOfficeAssignment(office);
  }
}
