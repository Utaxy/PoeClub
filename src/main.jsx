import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import './index.css';
import Navbar from './Navbar.jsx';
import Register from './Register.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path='/' element={<div>Homepage</div>} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<div>Login</div>} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
