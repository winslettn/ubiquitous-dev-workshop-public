package com.contoso.university.controller;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.model;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.view;

import com.contoso.university.repository.StudentRepository;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(HomeController.class)
class HomeControllerTest {

  @Autowired private MockMvc mockMvc;

  @MockBean private StudentRepository studentRepository;

  @Test
  void homePageLoads() throws Exception {
    mockMvc
        .perform(get("/").with(user("teacher").roles("TEACHER")))
        .andExpect(status().isOk())
        .andExpect(view().name("home/index"));
  }

  @Test
  void aboutPageBuildsEnrollmentStatistics() throws Exception {
    Mockito.when(studentRepository.findAll()).thenReturn(List.of());
    mockMvc
        .perform(get("/about").with(user("teacher").roles("TEACHER")))
        .andExpect(status().isOk())
        .andExpect(model().attributeExists("enrollmentCounts"))
        .andExpect(view().name("home/about"));
  }
}
