import React, { useEffect } from 'react';
import './ToastFood.css';

const Toast = ({ message, type, clearToast }) => {
  useEffect(() => {
    if (!message) return;

    // Set the timer to clear the toast after 3 seconds
    const timer = setTimeout(() => {
      clearToast(); // Clear the toast message after timeout
    }, 4000);

    // Cleanup function to clear the timer if the component unmounts
    return () => clearTimeout(timer);
  }, [message, clearToast]);

  return message ? (
    <div className={`toast ${type}`}>
      {message}
    </div>
  ) : null;
};


export default Toast;
