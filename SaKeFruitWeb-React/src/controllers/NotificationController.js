// Notification System for Admin Dashboard
const NOTIFICATION_KEY = 'sakefruit_notifications';
const NOTIFICATION_SOUND = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGWi78OScTQwNUKfj8LdjHAU=');

// Initialize notifications
export const initializeNotifications = () => {
  const notifications = localStorage.getItem(NOTIFICATION_KEY);
  if (!notifications) {
    localStorage.setItem(NOTIFICATION_KEY, JSON.stringify([]));
  }
};

// Add notification
export const addNotification = (notification) => {
  const notifications = getNotifications();
  const newNotification = {
    id: 'NOTIF' + Date.now(),
    ...notification,
    createdAt: new Date().toISOString(),
    isRead: false
  };
  
  notifications.unshift(newNotification); // Add to beginning
  localStorage.setItem(NOTIFICATION_KEY, JSON.stringify(notifications));
  
  // Dispatch event for real-time updates
  window.dispatchEvent(new CustomEvent('newNotification', { detail: newNotification }));
  
  return newNotification;
};

// Get all notifications
export const getNotifications = () => {
  const notifications = localStorage.getItem(NOTIFICATION_KEY);
  return notifications ? JSON.parse(notifications) : [];
};

// Get unread count
export const getUnreadCount = () => {
  const notifications = getNotifications();
  return notifications.filter(n => !n.isRead).length;
};

// Mark as read
export const markAsRead = (notificationId) => {
  const notifications = getNotifications();
  const updated = notifications.map(n => 
    n.id === notificationId ? { ...n, isRead: true } : n
  );
  localStorage.setItem(NOTIFICATION_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('notificationRead'));
};

// Mark all as read
export const markAllAsRead = () => {
  const notifications = getNotifications();
  const updated = notifications.map(n => ({ ...n, isRead: true }));
  localStorage.setItem(NOTIFICATION_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('notificationRead'));
};

// Clear all notifications
export const clearAllNotifications = () => {
  localStorage.setItem(NOTIFICATION_KEY, JSON.stringify([]));
  window.dispatchEvent(new Event('notificationRead'));
};

// Play notification sound
export const playNotificationSound = () => {
  try {
    NOTIFICATION_SOUND.play().catch(err => {
      console.log('Could not play notification sound:', err);
    });
  } catch (error) {
    console.log('Notification sound error:', error);
  }
};

// Send order notification to admin
export const sendOrderNotification = (order) => {
  const notification = {
    type: 'new_order',
    title: '🛒 Đơn hàng mới!',
    message: `${order.customerInfo.fullname} đã đặt đơn hàng ${order.id}`,
    orderData: {
      orderId: order.id,
      customerName: order.customerInfo.fullname,
      totalAmount: order.totalAmount,
      items: order.items.length
    }
  };
  
  addNotification(notification);
  playNotificationSound();
  
  // Show browser notification if permitted
  showBrowserNotification(notification);
};

// Request browser notification permission
export const requestNotificationPermission = () => {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }
};

// Show browser notification
const showBrowserNotification = (notification) => {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(notification.title, {
      body: notification.message,
      icon: '/assets/images/logo_6.png',
      badge: '/assets/images/logo_6.png',
      vibrate: [200, 100, 200]
    });
  }
};

// Initialize on load
initializeNotifications();
