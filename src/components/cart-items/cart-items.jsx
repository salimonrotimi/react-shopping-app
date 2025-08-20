import React from 'react'
import './cart-items.css'
import { useShopContext } from '../../context/shop-context'
import removeIcon from '../assets/remove-icon.png'
import addIcon from '../assets/add-icon.png'

function CartItems() {
    const {allProduct, cartItemValue, addToCart, removeFromCart, getTotalCartAmount} = useShopContext();
  return (
    <div className='cart-items'>
        <div className="cart-items-main">
            <p>Product</p> 
            <p>Title</p>
            <p>Price</p>
            <p>Qty</p>
            <p>Total</p>
            <p>Add More</p>
            <p className='cart-items-remove-header'>Remove</p>
        </div>
        <hr/>

        {allProduct.map((dataItem, index) => {
            if(cartItemValue[dataItem.product_id] > 0){
                return (
                    <div key={index}>
                        <div className="cart-items-main cart-items-format">
                            <img src={dataItem.product_image} alt='' className='cart-product-icon'/>
                            <p>{dataItem.product_title}</p>
                            <p>&#8358;{dataItem.new_price}</p>
                            <button className='cart-items-qty'>{cartItemValue[dataItem.product_id]}</button>
                            <p>&#8358;{dataItem.new_price * cartItemValue[dataItem.product_id]}</p>
                            <img src={addIcon} 
                                alt="" 
                                onClick={()=>{addToCart(dataItem.product_id)}}
                                className='add-cart-items' />
                            <img src={removeIcon} 
                                alt="" 
                                onClick={()=>{removeFromCart(dataItem.product_id)}}
                                className='remove-cart-items' />
                        </div>
                        <hr/>
                    </div>
                )
            }
            else {
                return null
            }
        })}

        <h1 className='shopping-summary-header'>Shopping Summary</h1>
        <div className="cart-items-summary">
            <div className="cart-items-total">
                <h1>Cart Totals</h1>
                <div>
                    <div className="cart-items-total-items">
                        <p>Subtotal</p>
                        <p>&#8358;{getTotalCartAmount()}</p>
                    </div>
                    <div className="cart-items-total-items">
                        <p>Shipping Fee</p>
                        <p>Free</p>
                    </div>
                    <hr />
                    <div className="cart-items-total-items">
                        <h3>Total</h3>
                        <p>&#8358;{getTotalCartAmount()}</p>
                    </div>
                </div>
                <button>Proceed To Checkout</button>
            </div>
            <div className="cart-items-promo-code">
                <h1>Promo Code</h1>
                <p>Enter promo code below if you have one.</p>
                <div className="cart-items-promo-code-box">
                    <input type="text" placeholder='Enter promo code' />
                    <button>Submit</button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default CartItems