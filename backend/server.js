import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import leadRoutes from './routes/leadRoutes.js';
import activityRoutes from './routes/activityRoutes.js';
import errorHandler from './middleware/errorHandler.js';

// Load Environment Variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();
const server = http.createServer(app);

// Setup CORS origin
const allowedOrigin = process.env.FRONTEND_URL || '*';

// Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: allowedOrigin,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

// Expose Socket.IO io instance to Express app
app.set('io', io);

// Middleware
app.use(cors({
  origin: allowedOrigin,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// Socket.IO events
io.on('connection', (socket) => {
  console.log(`Socket client connected: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`Socket client disconnected: ${socket.id}`);
  });
});

// REST API Routes
app.use('/api/leads', leadRoutes);
app.use('/api/activities', activityRoutes);

// Root route for server verification
app.get('/', (req, res) => {
  res.send('LeadFlow CRM API is running successfully.');
});

// Fallback for undefined routes
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'API Route not found' });
});

// Global Error Handler Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
