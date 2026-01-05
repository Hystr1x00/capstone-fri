// Notification Service - Handle notifications
class NotificationService {
  constructor() {
    this.storageKey = 'lab_notifications';
  }

  // Get all notifications
  getNotifications() {
    return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
  }

  // Add notification
  addNotification(notification) {
    const notifications = this.getNotifications();
    const newNotification = {
      id: Date.now(),
      ...notification,
      createdAt: new Date().toISOString(),
      read: false
    };
    notifications.unshift(newNotification); // Add to beginning
    // Keep only last 50 notifications
    if (notifications.length > 50) {
      notifications.splice(50);
    }
    localStorage.setItem(this.storageKey, JSON.stringify(notifications));
    return newNotification;
  }

  // Mark notification as read
  markAsRead(notificationId) {
    const notifications = this.getNotifications();
    const notification = notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      localStorage.setItem(this.storageKey, JSON.stringify(notifications));
    }
  }

  // Get unread count
  getUnreadCount() {
    const notifications = this.getNotifications();
    return notifications.filter(n => !n.read).length;
  }

  // Clear all notifications
  clearAll() {
    localStorage.setItem(this.storageKey, JSON.stringify([]));
  }
}

export default new NotificationService();

