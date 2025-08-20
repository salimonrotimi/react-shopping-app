import React from 'react'
import './item.css'
import { Link } from 'react-router-dom'

function Item(props) {
  // pass the id of the product image clicked to the "product" page through the <Link> tag.
  // window.scrollTo(0,0) automatically scrolls the linked new page to the top.
  return (
    <div className='item'>
        <Link to={`/product/${props.id}`} className='image-link'>
          <img src={props.image} alt='Collection item' onClick={window.scrollTo(0,0)}/>
        </Link>
        <p>{props.name}</p>
        <div className="item-prices">
            <div className="item-new-price">&#8358;{props.item_new_price}</div>
            <div className="item-old-price">&#8358;{props.item_old_price}</div>
        </div>
    </div>
  )
}

export default Item