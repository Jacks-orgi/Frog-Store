import React, { useState } from 'react';
import './Contact.css';
import axios from 'axios';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        'https://2-12.co.uk/~ddar/FrogStore/api/insert_message.php',
        { name, email, message },
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (response.data.success) {
        setFeedback('Message sent.');
        setIsSuccess(true);
        setName('');
        setEmail('');
        setMessage('');
      } else {
        setFeedback('Failed to send message.');
        setIsSuccess(false);
      }
    } catch (err) {
      console.error(err);
      setFeedback('Server error. Please try again later.');
      setIsSuccess(false);
    }
  };

  return (
    <div className="contact-page">
      <form onSubmit={handleSubmit} className="contact-form">
        <h1>Contact Us</h1>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your Email"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Your message"
            rows="5"
            required
          />
        </div>

        <button type="submit" className="submit-button">Submit</button>

      {feedback && (
        <p className={isSuccess ? 'success-message' : 'error-message'}>
          {feedback}
        </p>
      )}

      </form>

    </div>
  );
};

export default Contact;
