import React, {createContext, useContext, useState, useEffect} from 'react'
import { useAuthContext } from './auth-context';

// Set-up initial cart value
const getDefaultCartValue = () => {
    let cart = {};
    for(let index=0; index < 300; index++){
        cart[index] = 0;     // cart has value of 0 for each key i.e. {0:0, 1:0, 2:0, 3:0, ...}
    }
    return cart;
}


// Create ShopContext that will store all DB data and functions to be made available everywhere.
const ShopContext = createContext(null);     
/* The "ShopContext" that will be used as a tag i.e as <ShopContext.Provider> in the 
   ShopContextProvider() function, to store data and functions as its "value". 
 * The ShopContextProvider function will be exported and used as a tag i.e. as <ShopContextProvider>
   wrapped around the <App/> tag in the main or default page "index.js" file. This makes the DB data 
   and functions available everywhere for use in the project. 
*/

// The created "useShopContext()" function is later exported and used in the shop-category.jsx file 
// and other component files e.g. const {all_prods} = useShopContext();
const useShopContext = () => {
    const context = useContext(ShopContext);
    if(!context){
        throw new Error("useShopContext must be used within a ShopContextProvider");
    }
    return context;
}

// SHOP CONTEXT PROVIDER
const ShopContextProvider = (props) => {

    // React environment variable name must start with "REACT_APP_" to use it in the ".env" file.
    // React handles ".env" file by default. No need of installing "dotenv" or importing it.
    const reactApiUrl = process.env.REACT_APP_API_URL;

    // use the "authenticatedFetch()" function from the "auth-context.js" file
    const {isAuthenticated, authenticatedFetch} = useAuthContext()
    
    const [allProduct, setAllProduct] = useState([]);
    const [cartItemValue, setCartItemValue] = useState(getDefaultCartValue())

    // once the page loads, get all products, and pull all cart records once user has logged in.
    useEffect(()=>{
        getProductData();   
        allCartRecords();        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);    // the bracket [] means useEffect() should only run once when the component is loaded


    // GET ALL PRODUCTS: perform all retrieving operation here to prevent error. Uses the default
    // javascript "fetch()" api method as it requires no authentication.
    const getProductData = async() => {        
        try{
            const response = await fetch(`${reactApiUrl}/api/product`); // default mtd is "GET"
            const data = await response.json();

            if(!response.ok){
                alert(data.error_message);
                throw new Error(`Error status: ${response.status}`);
            }           
            
            if(data.success){     
                setAllProduct(data.final_results);
                console.log(data.final_results);
            }else{
                alert("Products retrieval failed.")
            }   
        } catch(error){
            console.error("Error: ", error)
        }
    }
    
    // SHOW THE CART TOTAL RECORDS if user is authenticated or has logged in
    const allCartRecords = async() => {
        if(isAuthenticated){
            const response = await authenticatedFetch(`${reactApiUrl}/api/auth/cart-total`, {
                method: "POST",
                credentials: "include", // includes the cookies created when user login
                headers: {
                    "Content-Type": "application/json",
                },
                body: "",
            });
            
            const data = await response.json();            
            setCartItemValue(data.result)   // set the "cartItemValue" from the database "result". 
            // This prevents loss of the cart total record for a user after he has logged out.
        }
    }

    // The "prev" argument in setCartItem() refers to the initial value of the cartItemValue i.e. 
    // {0:0, 1:0, 2:0, 3:0, ...}. The "...prev" uses the spread operator to unpack the key-value pairs 
    // of the "prev" object. 
    // The "[itemId]: prev[itemId]+1" update the unpacked key-value pairs by adding 1 to the previous 
    // value (which was 0 initially) at specified key [itemId]. For example if the selected item has 
    // itemId = 2, then the updated returned object becomes {0:0, 1:0, 2:1, 3:0, ...}

    const addToCart = async(itemId) => {
        // Update the "cartItemValue" with the "itemId" locally first
        setCartItemValue((prev)=>({...prev, [itemId]: prev[itemId]+1})) // cartItemValue which is a
        // function is updated here. Get the prev function, spread it, and update with the item id
        
        // Post the "itemId" to the database if the user has logged in.
        // If the localStorage has the "user" object saved (meaning user has already logged in)
        if(localStorage.getItem('user')){
            const response = await authenticatedFetch(`${reactApiUrl}/api/auth/addtocart`, {
                method: "POST",
                credentials: "include", // includes the cookies created when user login
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({"itemId": itemId}),
            });
            
            const data = await response.json();            
            console.log(data)
        }
    }

    // REMOVE FROM CART
    const removeFromCart = async(itemId) => {
        // Update the "cartItemValue" with the "itemId" locally first
        setCartItemValue((prev)=>({...prev, [itemId]: prev[itemId]-1}))

        // Post the "itemId" to the database if the user has logged in.
        // If the localStorage has the "user" object saved (meaning user has already logged in)
        if(localStorage.getItem('user')){
            const response = await authenticatedFetch(`${reactApiUrl}/api/auth/removefromcart`, {
                method: "POST",
                credentials: "include", // includes the cookies created when user login
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({"itemId": itemId}),
            });
            
            const data = await response.json();            
            console.log(data)
        }
    }

    // GET TOTAL PRODUCTS AMOUNT IN CART
    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for(const item in cartItemValue){   // "item" represents the key and is a string
            if(cartItemValue[item] > 0){
                // find in the "allProduct" where the product_id of each item in allProduct is equal 
                // to the "item" index in cartItemValue
                let itemInfo = allProduct.find((eachItem) => eachItem.product_id === Number(item))
                totalAmount += itemInfo.new_price * cartItemValue[item]
            } 
        }
        return totalAmount
    }

    // GET TOTAL ITEMS IN CART
    const getTotalCartItems = () => {
        let totalCart = 0;
        for(const item in cartItemValue){   // "item" represents the key and is a string
            if(cartItemValue[item] > 0){
                totalCart += cartItemValue[item]
            }
        }
        return totalCart
    }

    // Stores the DB data and all the functions as an object
    const contextValue = {
        allProduct, 
        cartItemValue, 
        addToCart, 
        removeFromCart, 
        getTotalCartItems, 
        getTotalCartAmount,
    }
    // The object will be destructured later with the same name in "shop-category.jsx" file or anywhere
    // the react's useContext() function is called. e.g. const {addToCart} = useContext(ShopContext);

    return(
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    )
}


export {useShopContext, ShopContextProvider}