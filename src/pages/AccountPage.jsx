import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../context/UserContext';

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
        console.log(authToken);

        const res = await axios.post(
          'https://2-12.co.uk/~ddar/FrogStore/api/get_user_details.php',
          { token: authToken },
          { headers: { 'Content-Type': 'application/json' } }
        );
        const data = res.data;

        console.log(data);
        if (data.success) {
          setUserDetails(data.user_details);
        } else {
          setError(data.message || 'Failed to fetch user details');
        }
      } catch (err) {
        console.log(err);
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="container">
      <h1>Account Details</h1>
      {userDetails ? (
        <div className="user-details">
          <div className="user-info">
            <p><strong>Username:</strong> {userDetails.username}</p>
            <p><strong>Email:</strong> {userDetails.email}</p>
          </div>

          <div className="address-info">
            <h3>Address Information</h3>
            {userDetails.address_line1 ? (
              <div>
                <p><strong>Address Line 1:</strong> {userDetails.address_line1}</p>
                {userDetails.address_line2 && <p><strong>Address Line 2:</strong> {userDetails.address_line2}</p>}
                <p><strong>City:</strong> {userDetails.city}</p>
                <p><strong>State:</strong> {userDetails.state}</p>
                <p><strong>Postcode:</strong> {userDetails.postcode}</p>
                <p><strong>Country:</strong> {userDetails.country}</p>
              </div>
            ) : (
              <p>No address information available</p>
            )}
          </div>

          <div className="card-info">
            <h3>Card Information</h3>
            {userDetails.card_number ? (
              <div>
                <p><strong>Card Number:</strong> {userDetails.card_number}</p>
                <p><strong>Expiration Date:</strong> {userDetails.expiration}</p>
              </div>
            ) : (
              <p>No card information available</p>
            )}
          </div>

          <button onClick={handleLogout}>Log Out</button>
        </div>
      ) : (
        <p>No user details available</p>
      )}
    </div>
  );
};

export default AccountPage;
