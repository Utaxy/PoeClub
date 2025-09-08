import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import './index.css';
import Navbar from './Navbar.jsx';
import Register from './Register.jsx';
import Login from './Login.jsx';
import Post from './Post.jsx';
import Messages from './Messages.jsx';
import { AuthProvider } from './Authcontext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path='/' element={<Messages />} />
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
          <Route path='/post' element={<Post />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
)
