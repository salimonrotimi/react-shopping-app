import React from 'react'
import "./offers.css"
import offers_image from '../assets/woman3.png'
import { Link } from 'react-router-dom'


function Offers() {
  return (
    <div className='offers'>
        <div className="offers-left">
            <h1>Unique offers <br/>exclusively for you</h1>
            <p>ONLY ON THE NO.1 SHOPPING MALL</p>
            <button>
              <Link to='/login' className='btn-link'>Check Now</Link>
            </button>
        </div>
        <div className="offers-right">
            <img src={offers_image} alt='Offers display'/>
        </div>
    </div>
  )
}

export default Offers