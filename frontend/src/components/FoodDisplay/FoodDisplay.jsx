import React, { useContext } from 'react'
import './FoodDisplay.css'
import { StoreContext } from '../../context/StoreContext'
import FoodItem from '../FoodItem/FoodItem'


const FoodDisplay = ({ category }) => {

    const { food_list } = useContext(StoreContext)

    return (
        <div className='food-display' id='food-display'>
            <h2>Top dishes near you </h2>
            <div className="food-display-list">
                {food_list.map((item, index) => {
                    {
                        // This if condition helps to filter all items.
                        if (category === 'All' || category === item.category) {
                            return <FoodItem key={index} id={item._id} name={item.name} stars={item.stars} description={item.description} price={item.price} image={item.image} type = {item.type}/>
                        }
                    }
                })}
            </div>
        </div>
    )
}

export default FoodDisplay
