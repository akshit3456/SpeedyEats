import React, { useContext } from 'react';
import './FoodItem.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalfAlt, faStar as faStarEmpty } from '@fortawesome/free-solid-svg-icons';

const FoodItem = () => {
  const { cartItems, addToCart, removeFromCart, url, food_list } = useContext(StoreContext);
  const token = localStorage.getItem('token');

  const renderStars = (stars) => {
    const totalStars = 5;
    const fullStars = Math.floor(stars);
    const halfStar = stars % 1 !== 0;
    const emptyStars = totalStars - fullStars - (halfStar ? 1 : 0);

    return [
      ...Array(fullStars).fill(<FontAwesomeIcon icon={faStar} style={{ color: 'tomato' }} />),
      halfStar && <FontAwesomeIcon icon={faStarHalfAlt} style={{ color: 'tomato' }} key="half-star" />,
      ...Array(emptyStars).fill(<FontAwesomeIcon icon={faStarEmpty} style={{ color: 'lightgray' }} />)
    ];
  };

  return (
    <div className="food-item-container">
      {food_list.length > 0 ? (
        food_list.map((item) => {
          return (
            <div className='food-item' key={item._id}>
              <div className="food-item-img-container">
                <img className='food-item-image' src={`${url}/images/${item.image}`} alt={item.name} />
                <div className="food-item-type-icon">
                  {item.kind === 'Veg' ? (
                    <img src={assets.green_icon_type} alt="Veg" />
                  ) : (
                    <img src={assets.red_icon_type} alt="Non-Veg" />
                  )}
                </div>
                {!cartItems[item._id] ? (
                  token && (
                    <img
                      className='add'
                      onClick={() => addToCart(item._id)}
                      src={assets.add_icon_white}
                      alt="Add to Cart"
                    />
                  )
                ) : (
                  <div className="food-item-counter">
                    <img onClick={() => removeFromCart(item._id)} src={assets.remove_icon_red} alt="Remove" />
                    <p>{cartItems[item._id]}</p>
                    <img onClick={() => addToCart(item._id)} src={assets.add_icon_green} alt="Add" />
                  </div>
                )}
              </div>

              <div className="food-item-info">
                <div className="food-item-name-rating">
                  <p>{item.name}</p>
                  <div className="food-item-rating">
                    {renderStars(item.rating)}
                  </div>
                </div>
                <p className="food-item-desc">{item.description}</p>
                <p className="food-item-price">₹{item.price}</p>
              </div>
            </div>
          );
        })
      ) : (
        <p>Loading food items...</p>
      )}
    </div>
  );
};

export default FoodItem;
