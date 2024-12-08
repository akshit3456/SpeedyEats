import React, { useContext, useState } from 'react';
import './Navbar.css';
import { assets } from '../../assets/assets';
import { Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import Search from '../Search/Search';
import { MdLocationOff } from "react-icons/md";
import Toast from '../ToastFood/ToastFood';


const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("home");
  const { getTotalCartAmount, token, setToken, setPromoCode } = useContext(StoreContext);
  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState('');
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userLocation");
    setToken("");
    setPromoCode("");
    navigate("/");
    window.location.reload();
  };

  const removeLocation = () => {
    localStorage.removeItem("userLocation");
    window.location.reload();
  };

  const handleCartClick = () => {
    setToastMessage(null);
    setToastType('');

    setTimeout(() => {
      const location = localStorage.getItem("userLocation");
    if (!location) {
      setToastMessage(" Current location required to access the cart."); // Replace with a toast if desired
      setToastType("info");
    } else {
      navigate('/cart');
    }
    }, 50);
    
  };

  const clearToast = () => {
    setToastMessage(null);
    setToastType('');
  };

  return (
    <div className="navbar">
      {toastMessage && <Toast message={toastMessage} type={toastType} clearToast={clearToast} />}
      <div className="navbar-left">
        <Link to="/"><img src={assets.logo} alt="" className="logo" /></Link>
        <Search />
      </div>
      <ul className="navbar-menu">
        <Link to="/" onClick={() => setMenu("home")} className={menu === "home" ? "active" : ""}>Home</Link>
        <a href="/#explore-menu" onClick={() => setMenu("menu")} className={menu === "menu" ? "active" : ""}>Menu</a>
        <a href="/#app-download" onClick={() => setMenu("mobile-app")} className={menu === "mobile-app" ? "active" : ""}>Mobile-app</a>
        <a href="#footer" onClick={() => setMenu("contact-us")} className={menu === "contact-us" ? "active" : ""}>Contact us</a>
      </ul>
      <div className="navbar-right">
        <div className="navbar-search-icon">
          {token && (
            <>
              <img 
                onClick={handleCartClick} 
                className="cart-image" 
                src={assets.basket_icon} 
                alt="Cart" 
              />
              <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
            </>
          )}
        </div>
        {!token ? (
          <button onClick={() => setShowLogin(true)}>Sign in</button>
        ) : (
          <div className="navbar-profile">
            <img src={assets.profile_icon} alt="Profile" />
            <ul className="nav-profile-dropdown">
              <li><img src={assets.bag_icon} alt="Orders" /><p>Orders</p></li>
              <hr />
              <li onClick={logout}><img src={assets.logout_icon} alt="Logout" /><p>Logout</p></li>
              <hr />
              <li onClick={removeLocation}><MdLocationOff className="location-off" /><p>Remove Location</p></li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
