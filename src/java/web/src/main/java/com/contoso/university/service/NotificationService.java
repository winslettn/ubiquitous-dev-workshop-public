package com.contoso.university.service;

import java.util.List;

public interface NotificationService {
  void sendNotification(
      String entityType, String entityId, String entityDisplayName, String operation);

  List<Notification> getLatest(int count);

  void markRead(int id);
}
