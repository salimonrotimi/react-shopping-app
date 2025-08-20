import React from 'react'
import './related-products.css'
import Item from '../reuseable-item/item'
import { useShopContext } from '../../context/shop-context'

function RelatedProducts(props){

    const {allProduct} = useShopContext();

    return(
        <div className="related-products">
            <h1>Related Products</h1>
            <hr/>
            <div className="related-product-items">
                {allProduct.map((dataItem, index)=>{                    
                    if(dataItem.category === props.prod.category){                        
                        if(dataItem.product_id !== props.prod.product_id){
                            // Select other products with product_id different from the current product_id
                            return <Item key={index}
                                        id={dataItem.product_id}
                                        name={dataItem.product_title}
                                        image={dataItem.product_image}
                                        item_old_price={dataItem.old_price}
                                        item_new_price={dataItem.new_price}
                            />
                        }
                        else {
                            return null
                        }
                    
                    }
                    
                    return null;                    
                })}
            </div>
        </div>
    )
}


export default RelatedProducts