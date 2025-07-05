import { io, Socket } from 'socket.io-client';

export interface Notification {
  id: string;
  type: 'buyer_match' | 'payment_received' | 'order_update' | 'quality_alert' | 'system_message';
  title: string;
  message: string;
  data?: any;
  read: boolean;
  createdAt: string;
  userId: string;
}

export interface NotificationPreferences {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  buyerMatches: boolean;
  paymentUpdates: boolean;
  qualityAlerts: boolean;
  systemMessages: boolean;
}

class NotificationService {
  private socket: Socket | null = null;
  private notifications: Notification[] = [];
  private listeners: Map<string, Function[]> = new Map();
  private baseUrl = 'http://localhost:5001';

  // Initialize WebSocket connection
  connect(userId: string, token: string) {
    if (this.socket?.connected) {
      return;
    }

    this.socket = io(this.baseUrl, {
      auth: {
        token,
        userId
      },
      transports: ['websocket', 'polling']
    });

    this.setupEventListeners();
  }

  // Disconnect WebSocket
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Setup event listeners
  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Connected to notification service');
      this.emit('connected', true);
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from notification service');
      this.emit('connected', false);
    });

    this.socket.on('notification', (notification: Notification) => {
      this.notifications.unshift(notification);
      this.emit('notification', notification);
      
      // Show browser notification if permission granted
      this.showBrowserNotification(notification);
    });

    this.socket.on('buyer_match', (data: any) => {
      const notification: Notification = {
        id: `match_${Date.now()}`,
        type: 'buyer_match',
        title: 'New Buyer Match!',
        message: `Found ${data.matchCount} potential buyers for your milk production`,
        data,
        read: false,
        createdAt: new Date().toISOString(),
        userId: data.farmerId
      };
      
      this.notifications.unshift(notification);
      this.emit('buyer_match', data);
      this.emit('notification', notification);
      this.showBrowserNotification(notification);
    });

    this.socket.on('payment_received', (data: any) => {
      const notification: Notification = {
        id: `payment_${Date.now()}`,
        type: 'payment_received',
        title: 'Payment Received!',
        message: `₹${data.amount} received from ${data.buyerName}`,
        data,
        read: false,
        createdAt: new Date().toISOString(),
        userId: data.sellerId
      };
      
      this.notifications.unshift(notification);
      this.emit('payment_received', data);
      this.emit('notification', notification);
      this.showBrowserNotification(notification);
    });

    this.socket.on('order_update', (data: any) => {
      const notification: Notification = {
        id: `order_${Date.now()}`,
        type: 'order_update',
        title: 'Order Update',
        message: `Your order status changed to: ${data.status}`,
        data,
        read: false,
        createdAt: new Date().toISOString(),
        userId: data.userId
      };
      
      this.notifications.unshift(notification);
      this.emit('order_update', data);
      this.emit('notification', notification);
      this.showBrowserNotification(notification);
    });

    this.socket.on('quality_alert', (data: any) => {
      const notification: Notification = {
        id: `quality_${Date.now()}`,
        type: 'quality_alert',
        title: 'Quality Alert',
        message: data.message,
        data,
        read: false,
        createdAt: new Date().toISOString(),
        userId: data.farmerId
      };
      
      this.notifications.unshift(notification);
      this.emit('quality_alert', data);
      this.emit('notification', notification);
      this.showBrowserNotification(notification);
    });
  }

  // Show browser notification
  private async showBrowserNotification(notification: Notification) {
    if (!('Notification' in window)) {
      return;
    }

    if (Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/dairy-lift-logo.png',
        badge: '/dairy-lift-logo.png',
        tag: notification.type,
        requireInteraction: notification.type === 'payment_received'
      });
    } else if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        this.showBrowserNotification(notification);
      }
    }
  }

  // Subscribe to events
  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  // Unsubscribe from events
  off(event: string, callback: Function) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      const index = eventListeners.indexOf(callback);
      if (index > -1) {
        eventListeners.splice(index, 1);
      }
    }
  }

  // Emit events
  private emit(event: string, data: any) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach(callback => callback(data));
    }
  }

  // Get all notifications
  getNotifications(): Notification[] {
    return this.notifications;
  }

  // Get unread notifications count
  getUnreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  // Mark notification as read
  markAsRead(notificationId: string) {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      this.emit('notification_read', notification);
    }
  }

  // Mark all notifications as read
  markAllAsRead() {
    this.notifications.forEach(n => n.read = true);
    this.emit('all_notifications_read', true);
  }

  // Clear all notifications
  clearAll() {
    this.notifications = [];
    this.emit('notifications_cleared', true);
  }

  // Send notification to specific user (admin function)
  async sendNotification(userId: string, notification: Omit<Notification, 'id' | 'createdAt' | 'userId' | 'read'>) {
    if (this.socket) {
      this.socket.emit('send_notification', {
        userId,
        ...notification
      });
    }
  }

  // Get notification preferences
  async getPreferences(): Promise<NotificationPreferences> {
    try {
      const response = await fetch(`${this.baseUrl}/api/notifications/preferences`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch preferences');
      }

      return await response.json();
    } catch (error) {
      console.error('Get notification preferences error:', error);
      // Return default preferences
      return {
        emailNotifications: true,
        smsNotifications: true,
        pushNotifications: true,
        buyerMatches: true,
        paymentUpdates: true,
        qualityAlerts: true,
        systemMessages: true
      };
    }
  }

  // Update notification preferences
  async updatePreferences(preferences: Partial<NotificationPreferences>): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/api/notifications/preferences`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeaders()
        },
        body: JSON.stringify(preferences)
      });

      if (!response.ok) {
        throw new Error('Failed to update preferences');
      }
    } catch (error) {
      console.error('Update notification preferences error:', error);
      throw error;
    }
  }

  // Request notification permission
  async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      return 'denied';
    }

    if (Notification.permission === 'default') {
      return await Notification.requestPermission();
    }

    return Notification.permission;
  }

  // Get auth headers
  private getAuthHeaders() {
    const headers: Record<string, string> = {};
    const token = localStorage.getItem('authToken');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }
}

export const notificationService = new NotificationService();
