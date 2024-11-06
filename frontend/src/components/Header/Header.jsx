import React from 'react'
import './Header.css'

const Header = () => {
  return (
    <div className='header'>
      <div className="header-contents">
        <h2> Order your favourite food here </h2>
        <p> we simplify your life with freshly prepared meals delivered to your door. We partner with trusted local restaurants and chefs to offer a wide selection of delicious options, from comforting favorites to healthy, innovative dishes, ensuring quality and taste in every order. </p>
        <a href="#explore-menu"><button>View Menu</button></a>
      </div>
    </div>
  )
}

export default Header
