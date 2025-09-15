import express from 'express';
import 'dotenv/config';
import postRegister from './routes/register.js';
import cors from 'cors';
import postLogin from './routes/login.js';
import postPost from './routes/post.js';
import messageRoute from './routes/message.js';

const PORT = process.env.PORT || 8000;
const app = express();

// CORS ayarları - production için
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? ['https://your-frontend-url.vercel.app'] // Buraya Vercel URL'ini yazacağız
        : ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true
}));

app.use(express.json());

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
    console.log(`🚀 Server is running on port ${PORT}`);
});



//postgresql://postgres:EOPWAUcwljTqOYsijZYSYeycXvjTRmca@yamanote.proxy.rlwy.net:56736/railway