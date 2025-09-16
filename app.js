import express from 'express';
import 'dotenv/config';
import postRegister from './routes/register.js';
import cors from 'cors';
import postLogin from './routes/login.js';
import postPost from './routes/post.js';
import messageRoute from './routes/message.js';

const PORT = process.env.PORT || 8000;
const app = express();

const whitelist = [
  'https://vip-club.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000'
];

app.use((req, res, next) => {
  console.log('CORS debug - Origin header:', req.headers.origin);
  next();
});

app.use(cors({
  origin: function(origin, callback) {
    // origin undefined olabilir (curl/postman) -> izin ver
    if (!origin) return callback(null, true);

    if (whitelist.includes(origin)) {
      return callback(null, true);
    }
    console.warn('Blocked by CORS:', origin);
    return callback(null, false); // izin yoksa false döner; tarayıcı CORS hatası alır
  },
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization','X-Requested-With']
}));

// Preflight'ı kesin cevapla
app.options('*', cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (whitelist.includes(origin)) return callback(null, true);
    return callback(null, false);
  },
  credentials: true
}));

app.use(express.json());

app.use((req, res, next) => {
  console.log('Origin header:', req.headers.origin);
  next();
});
// Routes
app.use(postRegister);
app.use(postLogin);
app.use(postPost);
app.use(messageRoute);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running!' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
