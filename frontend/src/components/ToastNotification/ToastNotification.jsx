import React from "react";
import "./ToastNotification.css";

const ToastNotification = ({ message, isVisible }) => {
  return (
    isVisible && (
      <div className="toast-notification">
        <div className="toast-icon">✔️</div>
        <p className="toast-message">{message}</p>
      </div>
    )
  );
};

export default ToastNotification;
