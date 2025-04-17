import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './RegisterPage.css';

const RegisterPage = () => {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const usernameExists = (username) => {
    return false; 
  };

  const isPasswordValid = (password) => {
    const minLength = password.length >= 5;
    const hasNumber = /\d/.test(password);
    return minLength && hasNumber;
  };


  const handleSubmit = (e) => {
    e.preventDefault();
  
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();
  
    if (!firstname || !lastname || !username || !password || !confirmPassword) {
      setError('Please fill all fields');
      return;
    }
  
    if (trimmedUsername.includes(' ') || trimmedPassword.includes(' ')) {
      setError('Username and password must not contain spaces.');
      return;
    }
  
    if (trimmedUsername.length < 5) {
      setError('Username must be at least 5 characters.');
      return;
    }

    if (usernameExists(trimmedUsername)) {
      setError('Username is already taken.');
      return;
    }
  
    if (!isPasswordValid(trimmedPassword)) {
      setError('Password must be at least 5 characters and contain at least 1 number.');
      return;
    }
  
    if (trimmedPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
  
    console.log('Account created!');
    setError(null); // clear any previous errors
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
