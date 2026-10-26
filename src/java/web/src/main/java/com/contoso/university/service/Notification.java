package com.contoso.university.service;

import java.time.Instant;

public class Notification {
  private final int id;
  private final String entityType;
  private final String entityId;
  private final String operation;
  private final String message;
  private final Instant createdAt;
  private boolean read;

  public Notification(
      int id,
      String entityType,
      String entityId,
      String operation,
      String message,
      Instant createdAt) {
    this.id = id;
    this.entityType = entityType;
    this.entityId = entityId;
    this.operation = operation;
    this.message = message;
    this.createdAt = createdAt;
  }

  public int getId() {
    return id;
  }

  public String getEntityType() {
    return entityType;
  }

  public String getEntityId() {
    return entityId;
  }

  public String getOperation() {
    return operation;
  }

  public String getMessage() {
    return message;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }

  public boolean isRead() {
    return read;
  }

  public void setRead(boolean read) {
    this.read = read;
  }
}
