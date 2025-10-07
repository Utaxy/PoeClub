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
  'https://poeclub.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000'
];

app.use((req, res, next) => next());

app.use(cors({
  origin(origin, cb) {
    if (!origin) return cb(null, true);
    if (whitelist.includes(origin)) return cb(null, true);
    console.warn('Blocked by CORS:', origin);
    return cb(null, false);
  },
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization','X-Requested-With','x-user-alias']
}));

app.use(express.json());


app.use(postRegister);
app.use(postLogin);
app.use(postPost);
app.use(messageRoute);
app.use(profileRoute);

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running!' });
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;
