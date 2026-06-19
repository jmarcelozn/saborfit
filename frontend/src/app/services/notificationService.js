let notify = null;

export function registerNotificationHandler(handler) {
  notify = handler;
}

export function showNotification(message, type = "info") {
  if (notify) {
    notify(message, type);
  }
}
