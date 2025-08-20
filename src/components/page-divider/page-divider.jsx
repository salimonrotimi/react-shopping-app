import React from 'react'
import './page-divider.css'
import hand from '../assets/waving-hand.png'
import display_image from '../assets/main.png'
import arrow_icon from '../assets/arrow.png'
import { Link } from 'react-router-dom'


function PageDivider() {
  return (
    <div className='page-divider'>
        <div className="pages">
          <div className="left-page">
            <h2>EXCLUSIVE STYLES MADE FOR YOU</h2>
            <div>
              <div className="hand-icon">
                <h3>Hurray!</h3>
                <img src={hand} alt='Waving hand'/>
              </div>
              <h3>New stylish collections</h3>
              <h3>for everyone</h3>
            </div>
            <div className="collection-btn">
              <Link to='/login' className='collection-btn-login'>
                <div>Recent Collections</div>
                <img src={arrow_icon} alt='Arrow icon' />
              </Link>
            </div>
          </div>

          <div className="right-page">
            <img src={display_image} alt='Shop display'/>
          </div>
        </div>
    </div>
  )
}

export default PageDivider