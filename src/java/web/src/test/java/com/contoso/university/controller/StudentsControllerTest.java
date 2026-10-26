package com.contoso.university.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.model;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.view;

import com.contoso.university.domain.Student;
import com.contoso.university.repository.StudentRepository;
import com.contoso.university.service.NotificationService;
import java.time.LocalDate;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentMatchers;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(StudentsController.class)
class StudentsControllerTest {

  @Autowired private MockMvc mockMvc;

  @MockBean private StudentRepository studentRepository;

  @MockBean private NotificationService notificationService;

  @Test
  @WithMockUser(roles = {"TEACHER"})
  void indexLoadsForTeacher() throws Exception {
    Student student = new Student();
    student.setId(1);
    student.setFirstMidName("Carson");
    student.setLastName("Alexander");
    student.setEnrollmentDate(LocalDate.of(2010, 9, 1));
    Mockito.when(studentRepository.findAll(ArgumentMatchers.any(PageRequest.class)))
        .thenReturn(new PageImpl<>(List.of(student)));

    mockMvc
        .perform(get("/students"))
        .andExpect(status().isOk())
        .andExpect(view().name("students/index"))
        .andExpect(model().attributeExists("studentsPage"));
  }
}
