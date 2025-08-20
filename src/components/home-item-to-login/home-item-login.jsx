import React from 'react'
import './home-item-login.css'
import { Link } from 'react-router-dom'

function HomeItemLogin(props) {  
  
  return (
    <div className='home-item'>
        <Link to={`/login-register`} className='image-link'>
          <img src={props.image} alt='Home item to login' />
        </Link>
        <p>{props.name}</p>
        <div className="home-item-prices">
            <div className="item-new-price">&#8358;{props.item_new_price}</div>
            <div className="item-old-price">&#8358;{props.item_old_price}</div>
        </div>
    </div>
  )
}

export default HomeItemLogin