import React from 'react'
import { useShopContext } from '../../context/shop-context'
import { useParams } from 'react-router-dom'
import PathDetail from '../../components/path-details/path-detail'
import ProductDisplay from '../../components/product-display/product-display'
import DescriptionBox from '../../components/description-box/description-box'
import RelatedProducts from '../../components/related-products/related-products'

function Product() {
  // "allProduct" is the current state of the data that is added as value to "contextValue" in 
  // "shop-context.jsx" file. The property name must be the same for destructuring
  const {allProduct} = useShopContext();
  // useParams() extracts the id value passed through the <Link> in the item.jsx file
  const {productId} = useParams()   // "productId" is declared in the <Route> tag in App.jsx file 
  const productIdNum = Number(productId)  // converts "productId" from string to a number

  // selects the single product details where "data.product_id === productIdNum"
  const product = allProduct.find((data) => data.product_id === productIdNum)

  // the "product" value (an object) is passed to the <PathDetail/> tag through the "prod" property 
  // for use in the path-detail.jsx file. "prod" becomes a property that has an object value.
  return (
    <div>
      <PathDetail prod={product}/>
      <ProductDisplay prod={product}/>
      <DescriptionBox/>
      <RelatedProducts prod={product}/>
    </div>
  )
}

export default Product