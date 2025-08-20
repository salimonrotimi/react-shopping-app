import React from 'react'
import forward_arrow from '../assets/arrow-icon.png'
import './path-detail.css'

function PathDetail(props) {
  
  // The div tag displays the path to each clicked image in the shop-category.jsx file
  // e.g. HOME > SHOP > men > Nice underwear for men
  return (
    <div className='path-detail'>
        HOME <img src={forward_arrow} alt='' /> 
        SHOP <img src={forward_arrow} alt='' /> 
        {props.prod.category} <img src={forward_arrow} alt='' /> {props.prod.name}
    </div>
  )

  /* OR
    // "props" points to the "prod" property (which has an object value) used 
    // when the <PathDetail/> tag was called in product.jsx file. It has to be destructured with the 
    // same name "prod". It is used as {prod.category} and {prod.name}

    const {prod} = props
    
    return (
      <div className='path-detail'>
        HOME <img src={forward_arrow} alt='' /> 
        SHOP <img src={forward_arrow} alt='' /> 
        {prod.category} <img src={forward_arrow} alt='' /> {prod.name}
      </div>
    )
  */

}

export default PathDetail