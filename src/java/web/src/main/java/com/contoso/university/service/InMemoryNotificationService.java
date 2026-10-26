package com.contoso.university.service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import org.springframework.stereotype.Service;

@Service
public class InMemoryNotificationService implements NotificationService {
  private final AtomicInteger idSequence = new AtomicInteger(0);
  private final List<Notification> notifications = new ArrayList<>();

  @Override
  public synchronized void sendNotification(
      String entityType, String entityId, String entityDisplayName, String operation) {
    String displayName =
        (entityDisplayName == null || entityDisplayName.isBlank()) ? entityId : entityDisplayName;
    String message =
        switch (operation) {
          case "CREATE" -> "New " + entityType + " '" + displayName + "' was created";
          case "UPDATE" -> entityType + " '" + displayName + "' was updated";
          case "DELETE" -> entityType + " '" + displayName + "' was deleted";
          default -> operation + " operation performed on " + entityType + " '" + displayName + "'";
        };
    notifications.add(
        new Notification(
            idSequence.incrementAndGet(), entityType, entityId, operation, message, Instant.now()));
  }

  @Override
  public synchronized List<Notification> getLatest(int count) {
    return notifications.stream()
        .sorted(
            Comparator.comparing(Notification::getCreatedAt)
                .thenComparingInt(Notification::getId)
                .reversed())
        .limit(count)
        .toList();
  }

  @Override
  public synchronized void markRead(int id) {
    notifications.stream().filter(n -> n.getId() == id).findFirst().ifPresent(n -> n.setRead(true));
  }
}
