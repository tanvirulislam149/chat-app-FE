import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passError, setPassError] = useState("");

  const handleSubmit = (e) => {
    setPassError("");
    e.preventDefault();
    if (password !== confirmPassword) {
      setPassError("Password didn't match");
      return;
    }
    const data = { name: userName, password: password }
    axios.post('http://localhost:5000/user/addUser', data)
      .then(function (response) {
        console.log(response);
        if (response.data.acknowledged) {
          localStorage.setItem('chatUserName', userName);
          localStorage.setItem('chatUserId', response.data.insertedId);
          navigate('/chat');
        }
      })
      .catch(function (error) {
        console.log(error);
      })
    setPassword("");
    setConfirmPassword("");
    setUserName("");
  };
  return (
    <form className="home__container" onSubmit={handleSubmit}>
      <h2 className="home__header">Register</h2>
      <label htmlFor="username">Username</label>
      <input
        type="text"
        name="username"
        id="username"
        className="username__input"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
      />
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
      <label htmlFor="username">Confirm Password</label>
      <input
        type="text"
        minLength={6}
        name="confirmPassword"
        id="confirmPassword"
        className="username__input"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <button className='goToRegister' onClick={() => navigate("/")}><u>Already registered? Click here to login.</u></button>
      <p className='passError'>{passError}</p>
      <button className="home__cta">Register</button>
    </form>
  )
}

export default Register