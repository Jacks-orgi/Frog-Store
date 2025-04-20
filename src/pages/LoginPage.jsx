import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './LoginPage.css';
import axios from 'axios';
import { useUser } from '../context/UserContext';

const LoginPage = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const { login } = useUser();

  useEffect(() => {
    const authToken = sessionStorage.getItem('authToken');
    if (authToken) {
      setIsLoggedIn(true);
      navigate('/account');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!usernameOrEmail || !password) {
      setError('Please fill all fields');
    } else {
      try {
        const res = await axios.post(
          'https://2-12.co.uk/~ddar/FrogStore/api/login.php',
          { 
            "usernameOrEmail" : usernameOrEmail, 
            "password" : password
          },
          { headers: { 'Content-Type': 'application/json' } }
        );
        
        const data = res.data;
        console.log(data);

        if (data.success) {
          setError('');
          login(data.key);
          setIsLoggedIn(true);
          navigate('/');
        } else {
          setError(data.message || 'Login failed');
        }
      } catch (err) {
        console.log(err);
        setError('Server error. Please try again later.');
      }
    }
  };

  if (isLoggedIn) {
    return (
      <div className="container">
        <h1>You're already logged in</h1>
        <p>Redirecting to home page...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Login</h1>
      <div className="form">
        <form onSubmit={handleSubmit}>
          <input
            id="formField"
            type="text"
            name="uname"
            value={usernameOrEmail}
            onChange={(e) => setUsernameOrEmail(e.target.value)}
            placeholder="Enter username or email"
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
