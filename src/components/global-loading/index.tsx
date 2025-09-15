import React from 'react';
import './styles.css';

const GlobalLoading: React.FC = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="loader"></div>
    </div>
  );
};

export default GlobalLoading;
