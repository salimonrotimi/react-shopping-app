import React from 'react'
import './shop-category.css'
import { useShopContext } from '../../context/shop-context'
import dropdown_image from '../../components/assets/dropdown-icon.png'
import Item from '../../components/reuseable-item/item'

function ShopCategory(props) {

  const {allProduct} = useShopContext() // "all_prods" is the name of the property that is
  // used for saving the data as the "contextValue" in "shop-context.jsx" file. The property name 
  // must be the same for destructuring.

  // "dataItem.id" pass the "id" value to the <Item/> tag for use in the item.jsx file
  return (
    <div className='shop-category'>
      <div className="shop-banner">
        <div className='banner-text'>
          <span className='big-text'>50% OFF</span>
          <span className='small-text'>LIMITED TIME OFFER</span>
          <button>Explore now</button>
        </div>
        <img src={props.banner} alt=''/>
      </div>

      <div className="shopcategory-index-sort">
        <p>
          Showing <span>1-10</span> of 30 products
        </p>
        <div className="shopcategory-sort">
          <span>Sort by</span> 
          <img src={dropdown_image} alt='' />
        </div>
      </div>

      <div className="shopcategory-products-container">
        <div className="shopcategory-products">
          {allProduct.map((dataItem, index) => {
            if (props.category === dataItem.category){
              return <Item key={index} 
                            id={dataItem.product_id}
                            name={dataItem.product_title} 
                            image={dataItem.product_image} 
                            item_new_price={dataItem.new_price}
                            item_old_price={dataItem.old_price} 
                      />
            }
            else {
              return null
            }
          })}
        </div>
      </div>

      <div className="shopcategory-explore-more">
        Explore more
      </div>
    </div>
  )
}

export default ShopCategory