import React, {useState, useEffect, useCallback} from 'react';
import './common.css';
import HomeItemLogin from '../home-item-to-login/home-item-login';
import {useAuthContext} from '../../context/auth-context';
import Item from '../reuseable-item/item';

function Common() {
  const reactApiUrl = process.env.REACT_APP_API_URL;
  const [commonInWomen, setCommonInWomen] = useState([]);
  const {isAuthenticated} = useAuthContext();

  // GET PRODUCTS COMMON AMONG WOMEN
  const getCommonForWomen = useCallback(async() => {        
      try{
          const response = await fetch(`${reactApiUrl}/api/product/common-in-women`); // default method is "GET"
          const data = await response.json();

          if(!response.ok){
            alert(data.error_message);
            throw new Error(`Error status: ${response.status}`);
          }  

          if(data.success){     
            setCommonInWomen(data.final_results);
            console.log(data.final_results);
          }else{
            alert("Products retrieval failed.")
          }         
      } catch(error){
          console.error("Error: ", error)
      }
  }, [reactApiUrl]);
  
  // call the function once immediately the component mounts
  useEffect(()=>{
    getCommonForWomen();
  }, [getCommonForWomen])

  return (
    <div className="common">
        <h1> COMMON AMONG WOMEN</h1>
        <hr/>
        <div className="common-item">
            {commonInWomen.map((eachItem, index) => {
                if(eachItem.product_id > 0){
                  if(!isAuthenticated){
                    return <HomeItemLogin key={index}
                              name={eachItem.product_title} 
                              image={eachItem.product_image}
                              item_new_price={eachItem.new_price}
                              item_old_price={eachItem.old_price}/>
                  }
                  else{
                     return <Item key={index}
                              id={eachItem.product_id} 
                              name={eachItem.product_title} 
                              image={eachItem.product_image} 
                              item_new_price={eachItem.new_price}
                              item_old_price={eachItem.old_price} 
                            />
                  }
                }
                else{
                  return null;
                }
            })}
        </div>            
    </div>
  )
}

export default Common