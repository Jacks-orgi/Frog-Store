import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../context/UserContext';
import './AccountPage.css';

const AccountPage = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { logout } = useUser();

  useEffect(() => {
    const authToken = sessionStorage.getItem('authToken');
    
    if (!authToken) {
      setError('No authentication token found. Please log in.');
      setLoading(false);
      navigate('/login');
      return;
    }

    const fetchUserDetails = async () => {
      try {
        const res = await axios.post(
          'https://2-12.co.uk/~ddar/FrogStore/api/get_all_user_details.php',
          { token: authToken },
          { headers: { 'Content-Type': 'application/json' } }
        );
        const data = res.data;
        if (data.success) {
          setUserDetails(data.user_details);
        } else {
          setError(data.message || 'Failed to fetch user details');
        }
      } catch (err) {
        setError('Server error. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) return <div className="account-container">Loading...</div>;
  if (error) return <div className="account-container error-message">{error}</div>;

  return (
    <div className="account-container">
      <h1>Account Details</h1>
      {userDetails ? (
        <div className="card-container">
          <div className="card">
            <h2>User Info</h2>
            <p><strong>Username:</strong> {userDetails.username}</p>
            <p><strong>Email:</strong> {userDetails.email}</p>
            <p><strong>Created:</strong> {new Date(userDetails.created_at).toLocaleDateString()}</p>
          </div>

          <div className="card">
            <h2>Address Info</h2>
            {userDetails.address_line1 ? (
              <>
                <p><strong>Address Line 1:</strong> {userDetails.address_line1}</p>
                {userDetails.address_line2 && <p><strong>Address Line 2:</strong> {userDetails.address_line2}</p>}
                <p><strong>City:</strong> {userDetails.city}</p>
                <p><strong>State:</strong> {userDetails.state}</p>
                <p><strong>Postcode:</strong> {userDetails.postcode}</p>
                <p><strong>Country:</strong> {userDetails.country}</p>
              </>
            ) : (
              <p>No address information available</p>
            )}
          </div>

          <div className="card">
            <h2>Card Info</h2>
            {userDetails.card_number ? (
              <>
                <p><strong>Card Number:</strong> **** **** **** {String(userDetails.card_number).slice(-4)}</p>
                <p><strong>Expiration:</strong> {userDetails.expiration}</p>
              </>
            ) : (
              <p>No card information available</p>
            )}
          </div>

          <button className="logout-btn" onClick={handleLogout}>Log Out</button>
        </div>
      ) : (
        <p>No user details available</p>
      )}
    </div>
  );
};

export default AccountPage;
