import React, { useContext } from 'react';
import './FoodItem.css';
import { assets, food_list } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalfAlt, faStar as faStarEmpty } from '@fortawesome/free-solid-svg-icons';

const FoodItem = ({ id, name, price,rating,description, image, kind }) => {
  const { cartItems, addToCart, removeFromCart,url} = useContext(StoreContext);
  const token = localStorage.getItem('token'); 

  const renderStars = (stars) => {
    if (stars >= 5.1) {
      return;
    }
    const totalStars = 5; // assuming a 5-star rating system
    const fullStars = Math.floor(stars);
    const halfStar = stars % 1 !== 0; // check if there's a half-star
    const emptyStars = totalStars - fullStars - (halfStar ? 1 : 0);

    const starIcons = [];

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      starIcons.push(<FontAwesomeIcon key={`full-${i}`} icon={faStar} style={{ color: 'tomato' }} />);
    }

    // Add half star if applicable
    if (halfStar) {
      starIcons.push(<FontAwesomeIcon key="half" icon={faStarHalfAlt} style={{ color: 'tomato' }} />);
    }

    // Add empty stars
    for (let i = 0; i < emptyStars; i++) {
      starIcons.push(<FontAwesomeIcon key={`empty-${i}`} icon={faStarEmpty} style={{ color: 'lightgray' }} />);
    }

    return starIcons;
  };


  return (
    <div className='food-item'>
      <div className="food-item-img-container">
        <img className='food-item-image' src={url+"/images/"+image} alt={name} />

        {<div className="food-item-type-icon">
          {kind == "Non-Veg" ? (
            <img src={assets.red_icon_type} alt="Non-Veg" />
          ) : (
            <img src={assets.green_icon_type} alt="Veg" />
          )}
         </div>}

        {/* Cart item handling */}
        {!cartItems[id]
          ? <>
            {token && (
              <img 
                className='add' 
                onClick={() => addToCart(id)} 
                src={assets.add_icon_white} 
                alt="Add to Cart" 
              />
            )}
          </>
          : <div className="food-item-counter">
              <img onClick={() => removeFromCart(id)} src={assets.remove_icon_red} alt="Remove" />
              <p>{cartItems[id]}</p>
              <img onClick={() => addToCart(id)} src={assets.add_icon_green} alt="Add" />
            </div>
        }
      </div>

      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p>{name}</p>
          <div className="food-item-rating">
            {renderStars(rating)}
          </div>
        </div>
        <p className="food-item-desc">{description}</p>
        <p className="food-item-price">₹{price}</p>
      </div>
    </div>
  );
}

export default FoodItem;

