import React from 'react';
import './App.css';
import Footer from './components/Footer/Footer';
import Founders from './components/Founders/Founders';
import Header from './components/Header/Header';
import LinkCard from './components/LinkCard/LinkCard';
import PlushieCardContent from './components/LinkCard/PlushieCardContent';
import SquishyCardContent from './components/LinkCard/SquishyCardContent';
import Mission from './components/Mission/Mission';
import Navbar from './components/Navbar/Navbar';

function App() {
  return (
    <div className="app">
      <Navbar />
      <Header />
      <div className="content">
        <div className="links-section">
          <LinkCard title="Plushies" link="#">
            <PlushieCardContent />
          </LinkCard>
          <LinkCard title="Stress Helpers" link="#">
            <SquishyCardContent />
          </LinkCard>
        </div>
        <Founders />
        <Mission />
      </div>
      <Footer />
    </div>
  );
}

export default App;