import React, { useEffect, useState, useCallback } from 'react';
import './new-stocks.css';
import HomeItemLogin from '../home-item-to-login/home-item-login';
import { useAuthContext } from '../../context/auth-context';
import Item from '../reuseable-item/item';

function NewStocks() {
  const reactApiUrl = process.env.REACT_APP_API_URL;
  const [newStockData, setNewStockData] = useState([]);
  const {isAuthenticated} = useAuthContext();

  // GET NEW STOCK PRODUCTS
  const getNewStockData = useCallback(async() => {        
      try{
          const response = await fetch(`${reactApiUrl}/api/product/newstocks`); // default method is "GET"
          const data = await response.json();
          
          if(!response.ok){
            alert(data.error_message);
            throw new Error(`Error status: ${response.status}`);
          }  

          if(data.success){     
            setNewStockData(data.final_results);
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
    getNewStockData();
  }, [getNewStockData]);

  return (
    <div className='new-stocks'>
        <h1>NEW STOCKS</h1>
        <hr/>
        <div className="stocks">
            {newStockData.map((dataItem,index)=>{
                if(dataItem.product_id > 0){
                  if(!isAuthenticated){
                    return <HomeItemLogin key={index} 
                              name={dataItem.product_title} 
                              image={dataItem.product_image}
                              item_new_price={dataItem.new_price}
                              item_old_price={dataItem.old_price} />
                  }
                  else{
                    return <Item key={index} 
                              id={dataItem.product_id} 
                              name={dataItem.product_title} 
                              image={dataItem.product_image}
                              item_new_price={dataItem.new_price}
                              item_old_price={dataItem.old_price} />
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

export default NewStocks