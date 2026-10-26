package com.contoso.university.controller;

import com.contoso.university.service.NotificationService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/notifications")
@PreAuthorize("hasRole('ADMIN')")
public class NotificationsController {
  private final NotificationService notificationService;

  public NotificationsController(NotificationService notificationService) {
    this.notificationService = notificationService;
  }

  @GetMapping
  public String index(Model model) {
    model.addAttribute("notifications", notificationService.getLatest(25));
    return "home/notifications";
  }

  @PostMapping("/{id}/read")
  public String markRead(@PathVariable int id) {
    notificationService.markRead(id);
    return "redirect:/notifications";
  }
}
