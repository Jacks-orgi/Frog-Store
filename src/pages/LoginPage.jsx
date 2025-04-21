import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import './LoginPage.css';

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
    <div className="login-container">
      <div className="login-card">
        <h2>Sign in or create an account</h2>
        <p className="login-subtitle">Enter your email to sign in or create an account</p>
        
        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="text"
            value={usernameOrEmail}
            onChange={(e) => setUsernameOrEmail(e.target.value)}
            placeholder="Email..."
            className="login-input"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password..."
            className="login-input"
          />
          
          <button type="submit" className="login-button">Log In</button>
          
          <Link to="/register" className="create-account-link">
            Don't have an account? Create one here
          </Link>
        </form>
        
        {error && <p className="error-message">{error}</p>}
      </div>
      
      <button onClick={() => navigate(-1)} className="back-button">Back</button>
    </div>
  );
};

export default LoginPage;
