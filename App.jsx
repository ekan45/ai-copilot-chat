import React from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';

function App() {
  return (
    <div className="app-container">
      <Sidebar />
      <ChatWindow />
    </div>
  );
}

export default App;
