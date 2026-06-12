import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import axios from 'axios';
import HomePage from './pages/HomePage';
// import HomePage1 from './pages/HomePage1';
// import HomeFeed from './pages/HomeFeed';

// import ProductPage from './ProductPage'

function App() {

  // useEffect(() => {
  //   // Test API call to backend
  //   axios.get('/api/test')
  //     .then(response => {
  //       console.log('API Response:', response.data);
  //     })
  //     .catch(error => {
  //       console.error('API Error:', error);
  //     });
  // }, []);
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect empty root path to login by default */}
        <Route path="/" element={<Navigate to="/home" replace />} />
        
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/home" element={<HomePage />} />
        {/* <Route path="/home1" element={<HomePage1 />} /> */}
        {/* <Route path="/feed" element={<HomeFeed />} /> */}

        {/* <Route path="/products" element={<ProductPage />} /> */}
      </Routes>
    </BrowserRouter>  
  )
}

export default App
