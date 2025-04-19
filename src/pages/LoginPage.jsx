import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './LoginPage.css';
import axios from 'axios';

const LoginPage = () => {
  const [usernameOrEmail, setusernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!usernameOrEmail || !password) {
      setError('Please fill all fields');
    } else {
      try {
        const res = await axios.post(
          'https://2-12.co.uk/~ddar/FrogStore/api/validate_user_credentials.php',
          { 
            "username_or_email" : usernameOrEmail, 
            "password" : password
          },
          { headers: { 'Content-Type': 'application/json' } }
        );
        
        const data = res.data;
        console.log(data);

        if (data.success) {
          setError('');
          navigate('/contact');
        } else {
          setError(data.message || 'Login failed');
        }
      } catch (err) {
        console.log(err);
        setError('Server error. Please try again later.');
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
            value={usernameOrEmail}
            onChange={(e) => setusernameOrEmail(e.target.value)}
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
