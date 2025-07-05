const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

class SocketService {
  constructor() {
    this.io = null;
    this.connectedUsers = new Map(); // userId -> socket
    this.userSockets = new Map(); // socketId -> userId
  }

  // Initialize Socket.IO server
  initialize(server) {
    this.io = new Server(server, {
      cors: {
        origin: ["http://localhost:3000", "http://localhost:8080"],
        methods: ["GET", "POST"],
        credentials: true
      },
      transports: ['websocket', 'polling']
    });

    this.setupMiddleware();
    this.setupEventHandlers();

    console.log('🔔 Socket.IO server initialized');
  }

  // Setup authentication middleware
  setupMiddleware() {
    this.io.use((socket, next) => {
      try {
        const token = socket.handshake.auth.token;
        const userId = socket.handshake.auth.userId;

        if (!token || !userId) {
          return next(new Error('Authentication error: Missing token or userId'));
        }

        // For now, accept any token (in production, verify JWT)
        // const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        socket.userId = userId;
        socket.token = token;
        
        next();
      } catch (error) {
        console.error('Socket authentication error:', error);
        next(new Error('Authentication error'));
      }
    });
  }

  // Setup event handlers
  setupEventHandlers() {
    this.io.on('connection', (socket) => {
      console.log(`🔗 User ${socket.userId} connected (${socket.id})`);

      // Store user connection
      this.connectedUsers.set(socket.userId, socket);
      this.userSockets.set(socket.id, socket.userId);

      // Join user to their personal room
      socket.join(`user_${socket.userId}`);

      // Send welcome notification
      socket.emit('notification', {
        id: `welcome_${Date.now()}`,
        type: 'system_message',
        title: 'Welcome to Dairy Marketplace!',
        message: 'You are now connected to real-time notifications.',
        data: {},
        read: false,
        createdAt: new Date().toISOString(),
        userId: socket.userId
      });

      // Handle custom events
      this.setupCustomEvents(socket);

      // Handle disconnection
      socket.on('disconnect', (reason) => {
        console.log(`🔌 User ${socket.userId} disconnected (${reason})`);
        this.connectedUsers.delete(socket.userId);
        this.userSockets.delete(socket.id);
      });

      // Handle errors
      socket.on('error', (error) => {
        console.error(`Socket error for user ${socket.userId}:`, error);
      });
    });
  }

  // Setup custom event handlers
  setupCustomEvents(socket) {
    // Handle sending notifications to specific users
    socket.on('send_notification', (data) => {
      if (data.userId && data.title && data.message) {
        this.sendNotificationToUser(data.userId, {
          id: `custom_${Date.now()}`,
          type: data.type || 'system_message',
          title: data.title,
          message: data.message,
          data: data.data || {},
          read: false,
          createdAt: new Date().toISOString(),
          userId: data.userId
        });
      }
    });

    // Handle joining specific rooms (for group notifications)
    socket.on('join_room', (roomName) => {
      socket.join(roomName);
      console.log(`User ${socket.userId} joined room: ${roomName}`);
    });

    // Handle leaving rooms
    socket.on('leave_room', (roomName) => {
      socket.leave(roomName);
      console.log(`User ${socket.userId} left room: ${roomName}`);
    });

    // Handle typing indicators (for chat features)
    socket.on('typing_start', (data) => {
      socket.to(data.roomId).emit('user_typing', {
        userId: socket.userId,
        userName: data.userName
      });
    });

    socket.on('typing_stop', (data) => {
      socket.to(data.roomId).emit('user_stopped_typing', {
        userId: socket.userId
      });
    });
  }

  // Send notification to specific user
  sendNotificationToUser(userId, notification) {
    const userSocket = this.connectedUsers.get(userId);
    if (userSocket) {
      userSocket.emit('notification', notification);
      console.log(`📧 Notification sent to user ${userId}: ${notification.title}`);
      return true;
    } else {
      console.log(`📧 User ${userId} not connected, notification queued`);
      // In production, store notification in database for later delivery
      return false;
    }
  }

  // Send notification to multiple users
  sendNotificationToUsers(userIds, notification) {
    const results = userIds.map(userId => {
      return {
        userId,
        sent: this.sendNotificationToUser(userId, {
          ...notification,
          userId,
          id: `${notification.id}_${userId}`
        })
      };
    });

    return results;
  }

  // Send notification to room
  sendNotificationToRoom(roomName, notification) {
    this.io.to(roomName).emit('notification', notification);
    console.log(`📢 Notification sent to room ${roomName}: ${notification.title}`);
  }

  // Broadcast notification to all connected users
  broadcastNotification(notification) {
    this.io.emit('notification', notification);
    console.log(`📢 Broadcast notification: ${notification.title}`);
  }

  // Send buyer match notification
  sendBuyerMatchNotification(farmerId, matchData) {
    const notification = {
      id: `match_${Date.now()}`,
      type: 'buyer_match',
      title: 'New Buyer Match Found!',
      message: `Found ${matchData.buyers.length} potential buyers for your milk production`,
      data: matchData,
      read: false,
      createdAt: new Date().toISOString(),
      userId: farmerId
    };

    this.sendNotificationToUser(farmerId, notification);
    
    // Also emit specific buyer_match event
    const userSocket = this.connectedUsers.get(farmerId);
    if (userSocket) {
      userSocket.emit('buyer_match', {
        farmerId,
        matchCount: matchData.buyers.length,
        buyers: matchData.buyers
      });
    }
  }

  // Send payment notification
  sendPaymentNotification(sellerId, paymentData) {
    const notification = {
      id: `payment_${Date.now()}`,
      type: 'payment_received',
      title: 'Payment Received!',
      message: `₹${paymentData.amount} received from ${paymentData.buyerName}`,
      data: paymentData,
      read: false,
      createdAt: new Date().toISOString(),
      userId: sellerId
    };

    this.sendNotificationToUser(sellerId, notification);
    
    // Also emit specific payment_received event
    const userSocket = this.connectedUsers.get(sellerId);
    if (userSocket) {
      userSocket.emit('payment_received', {
        sellerId,
        amount: paymentData.amount,
        buyerName: paymentData.buyerName,
        transactionId: paymentData.transactionId
      });
    }
  }

  // Send order update notification
  sendOrderUpdateNotification(userId, orderData) {
    const notification = {
      id: `order_${Date.now()}`,
      type: 'order_update',
      title: 'Order Status Updated',
      message: `Your order #${orderData.orderId} status changed to: ${orderData.status}`,
      data: orderData,
      read: false,
      createdAt: new Date().toISOString(),
      userId
    };

    this.sendNotificationToUser(userId, notification);
    
    // Also emit specific order_update event
    const userSocket = this.connectedUsers.get(userId);
    if (userSocket) {
      userSocket.emit('order_update', {
        userId,
        orderId: orderData.orderId,
        status: orderData.status,
        details: orderData
      });
    }
  }

  // Send quality alert notification
  sendQualityAlertNotification(farmerId, alertData) {
    const notification = {
      id: `quality_${Date.now()}`,
      type: 'quality_alert',
      title: 'Quality Alert',
      message: alertData.message,
      data: alertData,
      read: false,
      createdAt: new Date().toISOString(),
      userId: farmerId
    };

    this.sendNotificationToUser(farmerId, notification);
    
    // Also emit specific quality_alert event
    const userSocket = this.connectedUsers.get(farmerId);
    if (userSocket) {
      userSocket.emit('quality_alert', {
        farmerId,
        alertType: alertData.type,
        message: alertData.message,
        severity: alertData.severity
      });
    }
  }

  // Get connected users count
  getConnectedUsersCount() {
    return this.connectedUsers.size;
  }

  // Get connected users list
  getConnectedUsers() {
    return Array.from(this.connectedUsers.keys());
  }

  // Check if user is connected
  isUserConnected(userId) {
    return this.connectedUsers.has(userId);
  }

  // Disconnect user
  disconnectUser(userId) {
    const userSocket = this.connectedUsers.get(userId);
    if (userSocket) {
      userSocket.disconnect(true);
      return true;
    }
    return false;
  }
}

module.exports = new SocketService();
