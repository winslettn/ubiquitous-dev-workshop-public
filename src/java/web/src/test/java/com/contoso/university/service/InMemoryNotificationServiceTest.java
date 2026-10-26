package com.contoso.university.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;

class InMemoryNotificationServiceTest {

  @Test
  void createsAndMarksNotificationsRead() {
    InMemoryNotificationService service = new InMemoryNotificationService();
    service.sendNotification("Student", "1", "Alexander, Carson", "CREATE");
    service.sendNotification("Student", "1", "Alexander, Carson", "UPDATE");

    var notifications = service.getLatest(10);
    assertEquals(2, notifications.size());
    assertTrue(notifications.stream().map(Notification::getOperation).anyMatch("CREATE"::equals));
    assertTrue(notifications.stream().map(Notification::getOperation).anyMatch("UPDATE"::equals));
    assertTrue(notifications.stream().noneMatch(Notification::isRead));

    int id = notifications.get(0).getId();
    service.markRead(id);
    assertTrue(
        service.getLatest(10).stream()
            .filter(n -> n.getId() == id)
            .findFirst()
            .orElseThrow()
            .isRead());
  }
}
