
import express, { json } from 'express';

import taskRoutes from './routes/taskRoutes';
import assignmentRoutes from './routes/assignmentRoutes';
import attendanceRoutes from './routes/attendanceRoutes';
import reportRoutes from './routes/reportRoutes';
import analyticsRoutes from './routes/analyticsRoutes';

const app = express();

app.use(json()); 

app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

app.use('/api/tasks', taskRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/analytics', analyticsRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'VMS backend is running (PostgreSQL)' });
});


app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);

  
  if (err.name === 'SequelizeValidationError') {
    const messages = err.errors.map((e) => e.message);
    return res.status(400).json({ success: false, message: messages.join(', ') });
  }

  res.status(500).json({ success: false, message: 'Server error', error: err.message });
});

export default app;