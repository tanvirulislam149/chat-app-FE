import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    setError("");
    e.preventDefault();
    const data = { name: userName, password: password }
    axios.post('http://localhost:5000/user/getUser', data)
      .then(function (response) {
        if (response.status === 200) {
          setPassword("");
          setUserName("");
          localStorage.setItem('chatUserName', userName);
          localStorage.setItem('chatUserId', response.data._id);
          navigate('/chat');
        }
      })
      .catch(function (error) {
        if (error.response.status === 403) {
          setError("User not found. Please register first.")
        } else if (error.response.status === 401) {
          setError("Wrong password.")
        }
      })
  };
  return (
    <form className="home__container" onSubmit={handleSubmit}>
      <h2 className="home__header">Sign in to Open Chat</h2>
      <label htmlFor="username">Username</label>
      <input
        type="text"
        name="username"
        id="username"
        className="username__input"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
      /> <br />
      <label htmlFor="username">Password</label>
      <input
        type="text"
        minLength={6}
        name="password"
        id="password"
        className="username__input"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className='goToRegister' onClick={() => navigate("/register")}><u>New user? Click here to register.</u></button>
      <p className='passError'>{error}</p>
      <button className="home__cta">SIGN IN</button>
    </form>
  );
};

export default Login;