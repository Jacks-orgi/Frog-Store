import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegisterPage.css';

const RegisterPage = () => {
  var [firstname, setFirstname] = useState('');
  var [lastname, setLastName] = useState('');
  var [username, setUsername] = useState('');
  var [email, setEmail] = useState('');
  var [password, setPassword] = useState('');
  var [confirmPassword, setConfirmPassword] = useState('');
  var [error, setError] = useState('');

  const navigate = useNavigate();

  const isPasswordValid = (password) => {
    const minLength = password.length >= 5;
    const hasNumber = /\d/.test(password);
    return minLength && hasNumber;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    username = username.trim();
    password = password.trim();
  
    if (!firstname || !lastname || !username || !password || !confirmPassword) {
      setError('Please fill all fields');
      return;
    }
  
    if (username.includes(' ') || password.includes(' ')) {
      setError('Username and password must not contain spaces.');
      return;
    }
  
    if (username.length < 5) {
      setError('Username must be at least 5 characters.');
      return;
    }
  
    if (!isPasswordValid(password)) {
      setError('Password must be at least 5 characters and contain at least 1 number.');
      return;
    }
  
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const res = await axios.post(
        'https://2-12.co.uk/~ddar/FrogStore/api/insert_user.php',
        { 
          "firstname": firstname, 
          "lastname": lastname, 
          "username": username, 
          "email": email, 
          "password": password
        },
        { headers: { 'Content-Type': 'application/json' } }
      );
      
      const data = res.data;
      console.log(data);

      if (data.success) {
        setError(null);
        navigate('/home');
        console.log('Account created!');
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Server error. Please try again later.');
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Create Account</h2>
        
        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-columns">
            <div className="form-column">
              <input
                className="register-input"
                type="text"
                name="fname"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                placeholder="First Name*"
              />
              <input
                className="register-input"
                type="text"
                name="sname"
                value={lastname}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last Name*"
              />
              <input
                className="register-input"
                type="text"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username*"
              />
            </div>
            
            <div className="form-divider"></div>

            <div className="form-column">
              <input
                className="register-input"
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address*"
              />
              <input
                className="register-input"
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password*"
              />
              <input
                className="register-input"
                type="password"
                name="confirmpword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password*"
              />
            </div>
          </div>

          <button type="submit" className="register-button">Create Account</button>
          
          {error && <p className="error-message">{error}</p>}
        </form>
      </div>
      
      <button onClick={() => navigate(-1)} className="back-button">Back</button>
    </div>
  );
};

export default RegisterPage;
