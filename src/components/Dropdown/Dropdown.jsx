import React from 'react';
import './Dropdown.css';

const Dropdown = ({ label, options, onSelect, isOpen, setOpenDropdown, dropdownId }) => {
  const handleSelect = (value) => {
    onSelect(value);
    setOpenDropdown(null); 
  };

  const toggleDropdown = () => {
    setOpenDropdown(isOpen ? null : dropdownId); 
  };

  return (
    <div className="dropdown-container">
      <button
        className="dropdown-button"
        onClick={toggleDropdown}
      >
        {label}
      </button>
      {isOpen && (
        <div className="dropdown-menu">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;