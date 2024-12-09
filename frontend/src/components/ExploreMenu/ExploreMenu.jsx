import React, { useRef, useState, useEffect } from 'react';
import './ExploreMenu.css';
import { menu_list } from '../../assets/assets';
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";

const ExploreMenu = ({ category, setCategory }) => {
  const menuListRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Function to update arrow states based on scroll position
  const updateArrowStates = () => {
    const scrollLeft = menuListRef.current.scrollLeft;
    const scrollWidth = menuListRef.current.scrollWidth;
    const clientWidth = menuListRef.current.clientWidth;

    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth);
  };

  // Scroll left
  const scrollLeft = () => {
    menuListRef.current.scrollBy({
      left: -600,
      behavior: 'smooth',
    });
  };

  // Scroll right
  const scrollRight = () => {
    menuListRef.current.scrollBy({
      left: 600,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    // Initial check
    updateArrowStates();

    // Attach scroll event listener
    const menuElement = menuListRef.current;
    menuElement.addEventListener('scroll', updateArrowStates);

    // Cleanup on unmount
    return () => {
      menuElement.removeEventListener('scroll', updateArrowStates);
    };
  }, []);

  return (
    <div className="explore-menu" id="explore-menu">
      <h1>Explore our menu</h1>
      <p className="explore-menu-text">
        Pick from our awesome menu packed with tasty dishes made with top-notch ingredients and chef-level skills. We’re here to crush your cravings and make every meal seriously satisfying.
      </p>
      <div className="explore-menu-list-wrapper">
        <FaChevronLeft
          className={`left-arrow ${canScrollLeft ? 'active' : 'inactive'}`}
          onClick={canScrollLeft ? scrollLeft : null}
        />
        <div className="explore-menu-list" ref={menuListRef}>
          {menu_list.map((item, index) => (
            <div
              onClick={() => setCategory((prev) => (prev === item.menu_name ? 'All' : item.menu_name))}
              key={index}
              className="explore-menu-list-item"
            >
              <img
                className={category === item.menu_name ? 'active' : ''}
                src={item.menu_image}
                alt={item.menu_name}
              />
              <p>{item.menu_name}</p>
            </div>
          ))}
        </div>
        <FaChevronRight
          className={`right-arrow ${canScrollRight ? 'active' : 'inactive'}`}
          onClick={canScrollRight ? scrollRight : null}
        />
      </div>
      <hr />
    </div>
  );
};

export default ExploreMenu;
