import express from 'express';
import 'dotenv/config';
import postRegister from './routes/register.js';
import cors from 'cors';
import postLogin from './routes/login.js';
import postPost from './routes/post.js';
import messageRoute from './routes/message.js';

const PORT = process.env.PORT
const app = express();



app.use(cors());
app.use(express.json());


app.use(postRegister);
app.use(postLogin);
app.use(postPost);
app.use(messageRoute);


app.listen(PORT, ()=>{
    console.log(`Server is running on ${PORT}`)
})