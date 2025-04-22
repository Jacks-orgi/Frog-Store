import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [cardCSC, setCardCSC] = useState('');
  const [country, setCountry] = useState('');
  const [address_line1, setAddressLine1] = useState('');
  const [address_line2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postcode, setPostCode] = useState('');
  const [error, setError] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const navigate = useNavigate();
  const location = useLocation();

  const cart = location.state?.items || [];

  useEffect(() => {
    if (!cart || cart.length === 0) {
      navigate('/');
    }
  }, [cart, navigate]);

  if (cart.length === 0) {
    return <p>No items in cart.</p>;
  }

  const isPasswordValid = (password) => {
    const minLength = password.length >= 5;
    const hasNumber = /\d/.test(password);
    return minLength && hasNumber;
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[\d\s\-+()]{7,20}$/;
  const postcodeRegex = /^([A-Z]{1,2}\d[A-Z\d]? \d[A-Z]{2})$/i;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmed = [
      firstname, lastname, email, phone, password, confirmPassword,
      country, address_line1, city, state, postcode, username
    ].map((f) => f.trim());

    const [
      tFirstname, tLastname, tEmail, tPhone, tPassword, tConfirmPassword,
      tCountry, tAddress1, tCity, tState, tPostcode, tUsername
    ] = trimmed;

    if (!tFirstname || !tLastname || !tUsername || !tEmail || !tPassword || !tConfirmPassword ||
        !tCountry || !tAddress1 || !tCity || !tState || !tPostcode) {
      setError('Please fill all required fields');
      return;
    }

    if (tUsername.includes(' ') || tPassword.includes(' ')) {
      setError('Username and password must not contain spaces.');
      return;
    }

    if (tUsername.length < 5) {
      setError('Username must be at least 5 characters.');
      return;
    }

    if (!emailRegex.test(tEmail)) {
      setError('Invalid email format.');
      return;
    }

    if (!phoneRegex.test(tPhone)) {
      setError('Invalid phone number.');
      return;
    }

    if (!postcodeRegex.test(tPostcode)) {
      setError('Invalid postcode format.');
      return;
    }

    if (!isPasswordValid(tPassword)) {
      setError('Password must be at least 5 characters and contain at least 1 number.');
      return;
    }

    if (tPassword !== tConfirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const res = await axios.post(
        'https://2-12.co.uk/~ddar/FrogStore/api/create_user.php',
        {
          firstname: tFirstname,
          lastname: tLastname,
          username: tUsername,
          email: tEmail,
          phone: tPhone,
          password: tPassword,
          address_line1: tAddress1,
          address_line2: address_line2.trim(),
          city: tCity,
          postcode: tPostcode,
          country: tCountry,
          state: tState
        },
        { headers: { 'Content-Type': 'application/json' } }
      );

      const data = res.data;

      if (data.success) {
        setError(null);
        navigate('/ordersubmitted', { state: { items: cart } });
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    }
  };

  return (
    <div className="checkout-container">
      <div className="checkout-card">
        <h2>Checkout Page</h2>

        <form onSubmit={handleSubmit} className="checkout-form">
          <div className="form-columns">
            <div className="form-column">
              <input className="checkout-input" type="text" name="country" value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Country*" />
              <input className="checkout-input" type="text" name="address_line1" value={address_line1} onChange={(e) => setAddressLine1(e.target.value)} placeholder="Primary Street Address*" />
              <input className="checkout-input" type="text" name="address_line2" value={address_line2} onChange={(e) => setAddressLine2(e.target.value)} placeholder="Secondary Street Address" />
              <input className="checkout-input" type="text" name="city" value={city} onChange={(e) => setCity(e.target.value)} placeholder="City*" />
              <input className="checkout-input" type="text" name="state" value={state} onChange={(e) => setState(e.target.value)} placeholder="State / County*" />
              <input className="checkout-input" type="text" name="postcode" value={postcode} onChange={(e) => setPostCode(e.target.value)} placeholder="Postcode / Zip*" />
            </div>

            <div className="form-divider"></div>

            <div className="form-column">
              <div className="form-row">
                <input className="checkout-input" type="text" name="firstname" value={firstname} onChange={(e) => setFirstname(e.target.value)} placeholder="Firstname*" />
                <input className="checkout-input" type="text" name="lastname" value={lastname} onChange={(e) => setLastName(e.target.value)} placeholder="Lastname*" />
              </div>
              <input className="checkout-input" type="text" name="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username*" />
              <input className="checkout-input" type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address*" />
              <input className="checkout-input" type="text" name="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone Number*" />
              <input className="checkout-input" type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password*" />
              <input className="checkout-input" type="password" name="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm Password*" />
              <div className="form-group">
                <label htmlFor="cardnumber">Card Number</label>
                <input className="checkout-input" type="password" name="cardnumber" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} placeholder="Card Number*" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="expirationdate">Expiration Date</label>
                  <input className="checkout-input" type="text" name="expirationdate" value={expirationDate} onChange={(e) => setExpirationDate(e.target.value)} placeholder="MM / YY*" />
                </div>
                <div className="form-group">
                  <label htmlFor="cardcsc">Card Security Code</label>
                  <input className="checkout-input" type="text" name="cardcsc" value={cardCSC} onChange={(e) => setCardCSC(e.target.value)} placeholder="CSC*" />
                </div>
              </div>
            </div>
          </div>

          <button type="submit" className="checkout-button">Checkout</button>

          {error && <p className="error-message">{error}</p>}
        </form>
      </div>

      <button onClick={() => navigate(-1)} className="back-button">Back</button>
    </div>
  );
};

export default CheckoutPage;
