/**
 * @file main.jsx
 * @description Application entry point.
 *              Mounts the React app into #root and wraps everything in
 *              ThemeProvider (dark/light) and ChatProvider (conversation state).
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider } from './context/ThemeContext';
import { ChatProvider } from './context/ChatContext';
import './styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* ThemeProvider must be outermost — it sets the 'dark' class on <html> */}
    <ThemeProvider>
      {/* ChatProvider holds all conversation state and localStorage sync */}
      <ChatProvider>
        <App />
      </ChatProvider>
    </ThemeProvider>
  </React.StrictMode>
);
