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

  const navigate = useNavigate();
  const location = useLocation();

  const authToken = sessionStorage.getItem('authToken');
  const cart = location.state?.items || [];
  const total = location.state?.total || 0;

  useEffect(() => {
    if (!cart || cart.length === 0) {
      navigate('/');
    }
  }, [cart, navigate]);

  if (cart.length === 0) {
    return <p>No items in cart.</p>;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[\d\s\-+()]{7,20}$/;
  const postcodeRegex = /^([A-Z]{1,2}\d[A-Z\d]? \d[A-Z]{2})$/i;
  const cardNumberRegex = /^[0-9]{16}$/;
  const expirationDateRegex = /^(0[1-9]|1[0-2])\/\d{2}$/; // MM/YY format
  const cardCSCRegex = /^[0-9]{3,4}$/; // 3 or 4 digit CSC

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmed = [
      firstname, lastname, email, phone, country, address_line1, address_line2, city, state, postcode
    ].map((f) => f.trim());

    const [
      tFirstname, tLastname, tEmail, tPhone, tCountry, tAddress1, tAddress2, tCity, tState, tPostcode
    ] = trimmed;

    if (!tFirstname || !tLastname || !tEmail || !tCountry || !tAddress1 || !tCity || !tState || !tPostcode) {
      setError('Please fill all required fields');
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

      
    if (!cardNumberRegex.test(cardNumber)) {
      setError('Invalid card number');
      return false;
    }
  
    if (!expirationDateRegex.test(expirationDate)) {
      setError('Invalid expiration date format (MM/YY)');
      return false;
    }
  
    if (!cardCSCRegex.test(cardCSC)) {
      setError('Invalid card CSC');
      return false;
    }

    try {
      const res = await axios.post(
        'https://2-12.co.uk/~ddar/FrogStore/api/create_order.php',
        {
          firstname: tFirstname,
          lastname: tLastname,
          email: tEmail,
          phone: tPhone,            //optional
          address_line1: tAddress1,
          address_line2: tAddress2, //optional
          city: tCity,
          postcode: tPostcode,
          country: tCountry,
          state: tState,
          cardNumber,
          expirationDate,
          cardCSC,
          cart: cart,
          total: total,
          token: authToken          //optional       
        },
        { headers: { 'Content-Type': 'application/json' } }
      );

      const data = res.data;

      if (data.success) {
        setError(null);
        navigate("/ordersubmitted", { state: { items: cart, total: total} });
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
              <input className="checkout-input" type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address*" />
              <input className="checkout-input" type="text" name="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone Number*" />
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
