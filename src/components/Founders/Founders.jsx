import React from 'react';
import Founder1 from '../../assets/Founder1.png';
import Founder2 from '../../assets/Founder2.png';
import Founder3 from '../../assets/Founder3.png';
import Founder4 from '../../assets/Founder4.png';
import './Founders.css';

const Founders = () => {
  return (
    <section className="founders-section">
      <h2>Founders</h2>
      <div className="founders-images">
        <div className="founder-card">
          <img src={Founder1} alt="Founder 1" />
        </div>
        <div className="founder-card">
          <img src={Founder2} alt="Founder 2" />
        </div>
        <div className="founder-card">
          <img src={Founder3} alt="Founder 3" />
        </div>
        <div className="founder-card">
          <img src={Founder4} alt="Founder 4" />
        </div>
      </div>
    </section>
  );
};

export default Founders;