import React from 'react';
import './App.css';

function App() {
  return (
    <div className="app">
      <nav className="navbar">
        <div className="logo"></div>
        <div className="nav-items">
          <button className="nav-button">Home</button>
          <button className="nav-button">Shop</button>
          <button className="nav-button">Contact</button>
        </div>
        <div className="search-container">
          <input type="text" className="search-input" placeholder="Search..." />
        </div>
      </nav>

      <header className="header">
        <h1>Home</h1>
        <p>
          Info / Opening text
        </p>
      </header>

      <div className="content">
        <div className="links-section">
          <div className="link-card">
            <p>Hyperlink to the correct page / Image</p>
            <a href="#">Plushies →</a>
          </div>
          <div className="link-card">
            <p>Hyperlink to the correct page / Image</p>
            <a href="#">Stress Helpers →</a>
          </div>
        </div>

        <section className="founders-section">
          <h2>Founders</h2>
          <div className="founders-images">
            <div className="founder-card">Image</div>
            <div className="founder-card">Image</div>
            <div className="founder-card">Image</div>
            <div className="founder-card">Image</div>
          </div>
        </section>

        <section className="mission-section">
          <h2>Our Mission</h2>
          <p>
            About the store
          </p>
          <p>
            something extra
          </p>
        </section>
      </div>

      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} Comany name and the rights reserved bit</p>
      </footer>
    </div>
  );
}

export default App;