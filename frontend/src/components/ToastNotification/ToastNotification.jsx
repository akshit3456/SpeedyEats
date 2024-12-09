import React from "react";
import "./ToastNotification.css";
import { TiTick } from "react-icons/ti";
import { ImCross } from "react-icons/im";

const ToastNotification = ({ message, isVisible }) => {
  return (
    isVisible && (
      <div className="toast-notification">
        {message === "🎉 Promo code applied successfully! 🎉" ? <div className="toast-icon-tick"><TiTick /></div> : <div className="toast-icon"><ImCross /></div>}
        <p className="toast-message">{message}</p>
      </div>
    )
  );
};

export default ToastNotification;
