import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please fill all fields');
    } else if (username.includes(' ') || password.includes(' ')) {
      setError('Username and password must not contain spaces. Please try again');
    } else {
      if (username !== 'validUser' || password !== 'validPassword') {
        setError('Password incorrect. Please try again');
      } else {
        setError('');
        navigate('/dashboard');
      }
    }
  };

  return (
    <div className="container">
      <h1>Login</h1>
      <div className="form">
        <form onSubmit={handleSubmit}>
          <input
            id="formField"
            type="text"
            name="uname"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
          />
          <br />
          <input
            id="formField"
            type="password"
            name="pword"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
          />
          <br />
          <input id="formButton" type="submit" value="Login" />
        </form>
        {error && <p>{error}</p>}
      </div>
      <div>
        <span>Don't have an account? Create one </span>
        <Link to="/register" id="hereButton">here</Link>
      </div>
    </div>
  );
};

export default LoginPage;
