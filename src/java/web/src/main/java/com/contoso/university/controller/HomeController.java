package com.contoso.university.controller;

import com.contoso.university.domain.Student;
import com.contoso.university.repository.StudentRepository;
import java.util.Map;
import java.util.TreeMap;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {
  private final StudentRepository studentRepository;

  public HomeController(StudentRepository studentRepository) {
    this.studentRepository = studentRepository;
  }

  @GetMapping("/")
  public String index() {
    return "home/index";
  }

  @GetMapping("/about")
  public String about(Model model) {
    Map<String, Long> enrollmentCounts = new TreeMap<>();
    for (Student student : studentRepository.findAll()) {
      String key = student.getEnrollmentDate().toString();
      enrollmentCounts.put(key, enrollmentCounts.getOrDefault(key, 0L) + 1);
    }
    model.addAttribute("enrollmentCounts", enrollmentCounts);
    return "home/about";
  }
}
