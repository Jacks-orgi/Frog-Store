import React, { useEffect, useState } from 'react';
import './PlushieCardContent.css';

const PlushieCardContent = () => {
  const [eyePosition, setEyePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const eyes = document.getElementsByClassName('googly-eye-pupil');
      Array.from(eyes).forEach((eye) => {
        const rect = eye.getBoundingClientRect();
        const eyeCenterX = rect.left + rect.width / 2;
        const eyeCenterY = rect.top + rect.height / 2;

        const angle = Math.atan2(e.clientY - eyeCenterY, e.clientX - eyeCenterX);
        const distance = Math.min(5, Math.hypot(e.clientX - eyeCenterX, e.clientY - eyeCenterY) / 20);

        setEyePosition({
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance,
        });
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="plushie-card-content">
      <div className="plushie">
      <div className="plushie-belly"></div>
        <div className="frog-eyes">
          <div className="googly-eye">
            <div
              className="googly-eye-pupil"
              style={{
                transform: `translate(${eyePosition.x}px, ${eyePosition.y}px)`,
              }}
            />
          </div>
          <div className="googly-eye">
            <div
              className="googly-eye-pupil"
              style={{
                transform: `translate(${eyePosition.x}px, ${eyePosition.y}px)`,
              }}
            />
          </div>
        </div>
        <div className="frog-mouth"></div>
        <div className="frog-legs">
          <div className="leg">
            <div className="toe"></div>
          </div>
          <div className="leg">
            <div className="toe"></div>
          </div>
        </div>
      </div>
      <p>Meet our adorable frog plushie!</p>
    </div>
  );
};

export default PlushieCardContent;