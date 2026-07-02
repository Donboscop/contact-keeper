const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { getDashboardStats } = require('./controllers/contactController');
const { protect } = require('./middleware/authMiddleware');

// Load env variables
dotenv.config({ path: path.join(__dirname, '.env') });

// Connect Database
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Smart Contact Keeper API is healthy',
    timestamp: new Date()
  });
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/contacts', require('./routes/contactRoutes'));
app.get('/api/dashboard/stats', protect, getDashboardStats);

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static(path.join(__dirname, '../client/dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../', 'client', 'dist', 'index.html'));
  });
} else {
  // 404 handler for API routes in development
  app.use((req, res, next) => {
    res.status(404).json({ message: 'API Route not found' });
  });
}

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
