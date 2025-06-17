import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import swaggerDocs from './config/swagger.js';
import adminRoutes from './routes/adminRoutes.js';
dotenv.config();

const app = express();

swaggerDocs(app);
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);


// Connect to DB
mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log('MongoDB connected');
}).catch((err) => {
  console.error('MongoDB connection failed:', err);
});

// Routes
app.get('/', (req, res) => {
  res.send('Secure Deletion API is running');
});

console.log('`Email User:', process.env.EMAIL_USER); // Should not be undefined
console.log('Email Pass:', process.env.EMAIL_PASS ? 'Set' : 'Not set');

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

export default app;
