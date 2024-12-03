import './Search.css';
import React, { useState, useContext, useEffect } from 'react';
import { MdGpsFixed } from "react-icons/md";
import { FaLocationDot, FaCaretDown } from "react-icons/fa6";
import { StoreContext } from '../../context/StoreContext'; // Import context

const Search = () => {
  const [locationBox, setLocationBox] = useState('closed');
  const [localLocation, setLocalLocation] = useState('Location'); // Local state for UI
  const { setLocation } = useContext(StoreContext); // Access setLocation from context

  // useEffect(()=>{
  //   const savedLocation = localStorage.getItem("userLocation");
  //   if (savedLocation){
  //     setLocalLocation(savedLocation);
  //     setLocation(savedLocation);
  //   }
  // },[setLocation]);

  const toggleBox = () => {
    setLocationBox((prevState) => (prevState === 'closed' ? 'open' : 'closed'));
  };

  const getLiveLocation = () => {
    if (navigator.geolocation) {
      setLocalLocation('Fetching location...');

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`)
            .then((response) => response.json())
            .then((data) => {
              const fetchedLocation = data.city || data.locality || 'Location not found';
              setLocalLocation(fetchedLocation); // Update local state for UI
              setLocation(fetchedLocation); // Update global state in StoreContext
              // localStorage.setItem("userLocation",fetchedLocation);
              setLocationBox('closed'); 
            })
            .catch(() => {
              setLocalLocation('Unable to fetch location'); 
              setLocationBox('closed'); 
            });
        },
        () => {
          setLocalLocation('Location access denied'); 
          setLocationBox('closed'); 
        }
      );
    } else {
      setLocalLocation('Geolocation not supported');
      setLocationBox('closed'); 
    }
  };

  return (
    <div className="search-bar">
      <div className="search-pincode">
        <div className="search-location" >
          <FaLocationDot className="location-icon" />
          <p className="location-text">{localLocation}</p>
          <FaCaretDown
            onClick={toggleBox}
            className={`down-arrow ${locationBox === 'open' ? 'rotate-up' : ''}`}
          />
          <div
            id="location"
            className="location-box" onClick={getLiveLocation}
            style={{ display: locationBox === 'closed' ? 'none' : 'block' }}
          >
            <div className="gps-enable">
              <MdGpsFixed className="gps-icon" onClick={getLiveLocation} />
              <p className="gps-text" onClick={getLiveLocation}>
                Detect current location
              </p>
            </div>
            <div className="gps-textt">
              <p onClick={getLiveLocation}>Using GPS</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
