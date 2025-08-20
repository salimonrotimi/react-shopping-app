import React from 'react'
import './description-box.css'

function DescriptionBox() {
  return (
    <div className='description-box'>
        <div className="description-box-details">
            <div className="description-box-header">Description</div>
            <div className="description-box-header review">Reviews (20)</div>
        </div>
        <div className="description-box-description">
            <p>
                Product display on the site are exactly as they appear in reality making it a 
                reputable product you can rely on. Product purchased via the website will be 
                delivered within 5 working days and can be returned immediately if it does not 
                meet the desired expectation. Products can also be purchased from our outlets
                closest to you at amazing prices.
            </p>
            <p>
                Products displayed on the web page have detailed descriptions, images, current prices, 
                and are available in various sizes and colours. Payment for desired products can be 
                made online or on delivery.
            </p>
        </div>
    </div>
  )
}

export default DescriptionBox