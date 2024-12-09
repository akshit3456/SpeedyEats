import React, { useContext, useState } from 'react';
import './FoodItem.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalfAlt, faStar as faStarEmpty } from '@fortawesome/free-solid-svg-icons';
import Toast from '../ToastFood/ToastFood';

const FoodItem = ({ id, name, price, rating, description, image, kind }) => {
  const { cartItems, addToCart, removeFromCart, url, token, location } = useContext(StoreContext);
  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState('');

  const renderStars = (stars) => {
    const totalStars = 5;
    const fullStars = Math.floor(stars);
    const halfStar = stars % 1 !== 0;
    const emptyStars = totalStars - fullStars - (halfStar ? 1 : 0);

    return [
      ...Array(fullStars).fill(<FontAwesomeIcon icon={faStar} style={{ color: 'tomato' }} />),
      halfStar && <FontAwesomeIcon icon={faStarHalfAlt} style={{ color: 'tomato' }} />,
      ...Array(emptyStars).fill(<FontAwesomeIcon icon={faStarEmpty} style={{ color: 'lightgray' }} />),
    ];
  };

  const handleAddToCart = () => {
    setToastMessage(null);
    setToastType('');

    setTimeout(() => {
      if (!location && !token) {
        setToastMessage('Current location and sign-in required.');
        setToastType('error');
      } else if (!token) {
        setToastMessage('Sign in required.');
        setToastType('error');
      } else if (!location) {
        setToastMessage('Current location required.');
        setToastType('error');
      } else {
        addToCart(id);
        setToastMessage('Item added to cart');
        setToastType('success');
      }
    }, 50);
  };

  const handleRemoveFromCart = () => {
    setToastMessage(null);
    setToastType('');

    setTimeout(() => {
      if (cartItems[id] > 0) {
        removeFromCart(id);
        setToastMessage('Item removed from cart');
        setToastType('success');
      }
      else{
        setToastMessage('Item not removed from cart');
        setToastType('error');
      }
    }, 50);
  };

  const clearToast = () => {
    setToastMessage(null);
    setToastType('');
  };

  return (
    <>
      {toastMessage && <Toast message={toastMessage} type={toastType} clearToast={clearToast} />}
      <div className="food-item">
        <div className="food-item-img-container">
          <img className="food-item-image" src={`${url}/images/${image}`} alt={name} />
          <div className="food-item-type-icon">
            {kind === "Non-Veg" ? (
              <img src={assets.red_icon_type} alt="Non-Veg" />
            ) : (
              <img src={assets.green_icon_type} alt="Veg" />
            )}
          </div>
          {!cartItems[id] ? (
            <img
              className="add"
              onClick={handleAddToCart}
              src={assets.add_icon_white}
              alt="Add to Cart"
            />
          ) : (
            <div className="food-item-counter">
              <img
                onClick={handleRemoveFromCart}
                src={assets.remove_icon_red}
                alt="Remove"
              />
              <p>{cartItems[id]}</p>
              <img
                onClick={handleAddToCart}
                src={assets.add_icon_green}
                alt="Add"
              />
            </div>
          )}
        </div>
        <div className="food-item-info">
          <div className="food-item-name-rating">
            <p>{name}</p>
            <div className="food-item-rating">{renderStars(rating)}</div>
          </div>
          <p className="food-item-desc">{description}</p>
          <p className="food-item-price">₹{price}</p>
        </div>
      </div>
    </>
  );
};

export default FoodItem;
