import React, { useState } from 'react'
import './Add.css';
import { assets } from '../../assets/assets';
import axios from "axios";
import { toast } from 'react-toastify';

const Add = ({url}) => {

  const [image, setImage] = useState(false);
  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    category: "None",
    rating:"",
    kind:"",
  })

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({ ...data, [name]: value }))
  }

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", Number(data.price));
    formData.append("category", data.category);
    formData.append("image",image);
    formData.append("rating",Number(data.rating));
    formData.append("kind",data.kind);
    
    const response = await axios.post(`${url}/api/food/add`,formData);
    if (response.data.success) {
        setData({
          name: "",
          description: "",
          price: "",
          category: "None",
          rating:"",
          kind:"",
        })
        setImage(false);
        toast.success(response.data.message)
    }
    else{
        toast.error(response.data.message);
    }
  }

  return (
    <div className='add'>
      <form className='flex-col' onSubmit={onSubmitHandler}>
        <div className="add-img-upload flex-col">
          <p>Upload Image</p>
          <label htmlFor="image">
            <img src={image ? URL.createObjectURL(image) : assets.upload_area} alt="" />
          </label>
          <input onChange={(e) => setImage(e.target.files[0])} type="file" id='image' hidden required />
        </div>
        <div className="add-product-name flex-col">
          <p>Food name</p>
          <input onChange={onChangeHandler} value={data.name} type="text" name='name' placeholder='Type here' required />
        </div>
        <div className="add-product-description flex-col">
          <p>Food description</p>
          <textarea onChange={onChangeHandler} value={data.description} name="description" rows="6" placeholder='Write content here ' required></textarea>
        </div>
        <div className='product-rating-kind'>
        <div className='product-rating flex-col'>
          <p>Food rating</p>
          <textarea onChange={onChangeHandler} value={data.rating} type= "Number" name='rating' placeholder='Rating' required min={0}></textarea>
        </div>
        <div className='product-kind flex-col'>
          <p>Food kind</p>
          <textarea onChange={onChangeHandler} value={data.kind} name='kind' placeholder='Kind' required></textarea>
        </div>
        </div>
        <div className="add-category-price">
          <div className="add-category flex-col">
            <p>Food category</p>
            <select onChange={onChangeHandler} name="category" required>
              <option value="None">None</option>
              <option value="Salad">Salad</option>
              <option value="Rolls">Rolls</option>
              <option value="Deserts ">Deserts</option>
              <option value="Sandwich">Sandwich</option>
              <option value="Cake">Cake</option>
              <option value="Pure Veg">Pure Veg</option>
              <option value="Pasta">Pasta</option>
              <option value="Noodles">Noodles</option>
              <option value="Burger">Burger</option>
              <option value="Pizza">Pizza</option>
              <option value="Momos">Momos</option>
              <option value="North Indian">North Indian</option>
            </select>
          </div>
          <div className="add-price flex-col">
            <p>Food Price</p>
            <input onChange={onChangeHandler} value={data.price} type="Number" name='price' placeholder='₹200' required min={0}/>
          </div>
        </div>
        <button type='submit' className='add-btn'>
          ADD
        </button>
      </form>
    </div>
  )
}

export default Add
