import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './RegisterPage.css';
import axios from 'axios';

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
          "firstname" : firstname, 
          "lastname" : lastname, 
          "username" : username, 
          "email" : email, 
          "password" : password
        },
        { 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
      
      const data = res.data;
      console.log(data);

      if (data.success) {
        setError(null);
        navigate('/contact');
        console.log('Account created!');
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Server error. Please try again later.');
    }
  };
  

  return (
    <div className="container">
      <h1>Register Page</h1>
      <div className="form">

        <form onSubmit={handleSubmit}>
          <input
            id="formField"
            type="text"
            name="fname"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
            placeholder="Enter firstname"
          />

          <input
            id="formField"
            type="text"
            name="sname"
            value={lastname}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Enter lastname"
          />
          <br />

          <input
            id="formField"
            type="username"
            name="pword"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
          />
          <br />

          <input
            id="formField"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email address"
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

          <input
            id="formField"
            type="password"
            name="confirmpword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm password"
          />
          <br />

          <input id="formButton" type="submit" value="Register" />
        </form>

        {error && <p>{error}</p>}
      </div>
      <div>
        <span>Don't have an account? Create one </span>
        <Link to="/login" id="hereButton">here</Link>
        </div>
    </div>
  );
};

export default RegisterPage;
