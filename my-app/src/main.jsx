// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx'; // Import component App chính của bạn
import './index.css'; // Import file CSS chính của bạn (đã bao gồm Tailwind)

// Tạo một root React và render ứng dụng của bạn vào phần tử DOM có id 'root'
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
