import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import tasksRouter from './routes/tasks.js';

const app = express();

app.disable('x-powered-by');
app.use(helmet());
app.use(cors({
  origin(origin, callback) {
    const configured = (process.env.CORS_ORIGIN || 'http://localhost:5173')
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    // Allow requests without Origin (curl, server-to-server health checks).
    if (!origin || configured.includes(origin)) return callback(null, true);
    return callback(new Error('Origin is not allowed by CORS'));
  }
}));
app.use(express.json({ limit: '100kb' }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

app.get('/', (_req, res) => {
  res.json({
    name: 'JavaScript Backend Starter',
    status: 'running',
    docs: 'See README.md for available endpoints'
  });
});

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/tasks', tasksRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err, _req, res, _next) => {
  if (err.message === 'Origin is not allowed by CORS') {
    return res.status(403).json({ error: 'Origin is not allowed by CORS' });
  }
  if (err instanceof SyntaxError && 'body' in err) {
    return res.status(400).json({ error: 'Invalid JSON body' });
  }
  console.error(err);
  return res.status(500).json({ error: 'Internal server error' });
});

export default app;
