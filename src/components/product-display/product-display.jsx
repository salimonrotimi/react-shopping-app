import React from 'react'
import './product-display.css'
import bright_star from '../assets/star-icon-bright.png'
import dull_star from '../assets/star-icon-dull.png'
import { useShopContext } from '../../context/shop-context'

// Arrow function is used here
const ProductDisplay = (props) => {

  // When user clicks the "Add to Cart" button, the "product_id" is passed to the "addToCart" function
  // in the "shop-context.jsx" file and then is posted/pushed to the database for update of the id
  // of the product in the "cartData" database field.
  
  const {addToCart} = useShopContext();

  return (
    <div className='product-display'>
        <div className="product-display-left">
            <div className="product-display-imagelist">
                <img src={props.prod.product_image} alt=''/>
                <img src={props.prod.product_image} alt=''/>
                <img src={props.prod.product_image} alt=''/>
                <img src={props.prod.product_image} alt=''/>                
            </div>
            <div className="product-display-image">
                <img className='product-display-big-image' src={props.prod.product_image} alt=''/>
            </div>
        </div>

        <div className="product-display-right">
            <h1>{props.prod.product_title}</h1>
            <div className="product-display-star-rating">
                <div>
                    <img src={bright_star} alt=''/>
                    <img src={bright_star} alt=''/>
                    <img src={bright_star} alt=''/>
                    <img src={bright_star} alt=''/>
                    <img className='dull-star' src={dull_star} alt=''/>
                </div>
                <p>4.0</p>
            </div>
            <div className="product-display-price">
                <div className="product-display-old-price">&#8358;{props.prod.old_price}.00</div>
                <div className="product-display-new-price">&#8358;{props.prod.new_price}.00</div>
            </div>
            <div className="product-display-description">
                An usual beautiful, durable and well-crafted clothing material for your everyday use. 
                Clothes are available in various sizes that suit your specific needs.
            </div>
            <div className="product-display-size">
                <h1>Select Size</h1>
                <div className="product-display-size-category">
                    <div>S</div>
                    <div>M</div>
                    <div>L</div>
                    <div>XL</div>
                    <div>XXL</div>
                </div>
            </div>
            <button onClick={()=>{addToCart(props.prod.product_id)}}>Add to Cart</button>
            <div className="product-display-category"><span>Category: </span>{props.prod.category}, Wears, Clothing</div>
            <div className="product-display-tag"><span>Tags: </span>Modern, Latest, Classic</div>
        </div>
    </div>
  )
}

export default ProductDisplay