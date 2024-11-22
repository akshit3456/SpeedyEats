import './Search.css';
import React, { useState } from 'react';
import { CiLocationOn } from "react-icons/ci";
import { MdGpsFixed } from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";
import { FaCaretDown } from "react-icons/fa6";
import { IoSearchOutline } from "react-icons/io5";

const Search = () => {
  const [locationBox, setLocationBox] = useState('closed');
  const [location, setLocation] = useState('Location');

  const toggleBox = () => {
    setLocationBox(prevState => (prevState === 'closed' ? 'open' : 'closed'));
  };

  const getLiveLocation = () => {
    if (navigator.geolocation) {
      setLocation('Fetching location...');
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
            fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`)
            .then(response => response.json())
            .then(data => {
              setLocation(data.city || data.locality || 'Location not found');
              setLocationBox('closed'); // Close the dropdown after fetching
            })
            .catch(() => {
              setLocation('Unable to fetch location');
              setLocationBox('closed'); // Close the dropdown on error
            });
        },
        () => {
          setLocation('Location access denied');
          setLocationBox('closed'); // Close the dropdown on access denial
        }
      );
    } else {
      setLocation('Geolocation not supported');
      setLocationBox('closed'); // Close the dropdown if geolocation is unsupported
    }
  };

  return (
    <div className='search-bar'>
      <div className='search-pincode'>
        <div className='search-location'>
          <FaLocationDot className='location-icon' />
          <p className='location-text'>{location}</p>
          {/* Rotate the arrow based on dropdown state */}
          <FaCaretDown
            onClick={toggleBox}
            className={`down-arrow ${locationBox === 'open' ? 'rotate-up' : ''}`}
          />
          <div
            id="location"
            className='location-box'
            style={{ display: locationBox === 'closed' ? 'none' : 'block' }}
          >
            <div className='gps-enable'>
              <MdGpsFixed className='gps-icon' onClick={getLiveLocation} />
              <p className='gps-text' onClick={getLiveLocation}>Detect current location</p>
            </div>
            <div className='gps-textt'>
              <p onClick={getLiveLocation} >Using GPS</p>
            </div>
          </div>
          <div className='divide'></div>
          <IoSearchOutline className='search-icon'/>
        </div>
      </div>
    </div>
  );
};

export default Search;
