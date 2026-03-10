import React from 'react';

const Banner = ({ title, subtitle }) => {
  return (
    <header className="banner">
      <div className="container">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
    </header>
  );
};

export default Banner;
