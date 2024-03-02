import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ChatPage from './Components/Home/ChatPage/ChatPage';
import ProtectedRoute from './Components/ProtectedRoute';
import Login from './Components/Home/Home';
import Register from './Components/Register/Register';
import { io } from "socket.io-client";

const socket = io("http://localhost:5000/chat");

function App() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<Login />}></Route>
          <Route path="/register" element={<Register />}></Route>
          <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>}></Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
