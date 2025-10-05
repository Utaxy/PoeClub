import express from 'express';
import 'dotenv/config';
import postRegister from './routes/register.js';
import cors from 'cors';
import postLogin from './routes/login.js';
import postPost from './routes/post.js';
import messageRoute from './routes/message.js';
import profileRoute from './routes/profile.js';

const PORT = process.env.PORT || 8000;
const app = express();

const whitelist = [
  'https://poeclub.vercel.app', // prod domainin; gerekiyorsa değiştir
  'http://localhost:5173',
  'http://localhost:3000'
];

app.use((req, res, next) => { next(); });

app.use(cors({
  origin(origin, callback) {
    if (!origin) return callback(null, true);
    if (whitelist.includes(origin)) return callback(null, true);
    console.warn('Blocked by CORS:', origin);
    return callback(null, false);
  },
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization','X-Requested-With','x-user-alias']
}));

app.use(express.json());

// Routes
app.use(postRegister);
app.use(postLogin);
app.use(postPost);
app.use(messageRoute);
app.use(profileRoute);

// Health check (support both paths for serverless routing tests)
const healthHandler = (req, res) => {
  res.json({ status: 'OK', message: 'Server is running!' });
};
app.get('/health', healthHandler);
app.get('/api/health', healthHandler);

// Lokal/harici sunucuda dinle (Vercel'de export edilir)
if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;
