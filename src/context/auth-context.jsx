import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react'
import { Navigate } from 'react-router-dom';


// create the AuthContext
const AuthContext = createContext(null);

// Customized hook named "useAuthContext" for using the created "AuthContext". There is no need for 
// exporting the "AuthContext" again since "useAuthContext" has been exported.
const useAuthContext = () => {
  const context = useContext(AuthContext);
  if(!context){
    throw new Error('useAuthContext must be used within an AuthContextProvider');
  }
  return context;
}

// Declare the "AuthContextProvider" where the created "AuthContext" will be used.
// AUTH. CONTEXT PROVIDER 
const AuthContextProvider = ({children}) => {

    // React environment variable name must start with "REACT_APP_" to use it in the ".env" file
    const baseURL = process.env.REACT_APP_API_URL;

    // Auth states
    const [user, setUser] = useState(null);     // "user" is initially set to "null"
    //const [loading, setLoading] = useState(true);   // "loading" is initially set to "true"
    const [isRefreshing, setIsRefreshing] = useState(false); // "isRefreshing" is set to "false"

    // Refs for managing refresh state and avoiding competition btween states
    const isRefreshingRef = useRef(false); // "isRefreshingRef" initial value is "false"
    const refreshPromiseRef = useRef(null); // "refreshPromiseRef" initial value is "null"
    const baseURLRef = useRef(baseURL); // "baseURLRef" initial value is "baseURL" i.e "http://localhost:4000"

    // update baseURL in useEffect() when component prop changes i.e. [baseURL]
    useEffect(()=>{
        console.log(baseURL)
        baseURLRef.current = baseURL;        
    }, [baseURL]);    


    // GENERATE DEVICE ID for user device to track authentication
    const generateDeviceId = useCallback(()=>{
        // get the "deviceId" from the browser's local storage if it was previously stored there
        let deviceId = localStorage.getItem('deviceId');
        // if deviceId does not exist in local storage, create and save it there for future use
        if(!deviceId){
            deviceId = "device_" + Math.random().toString(36).substring(2, 11) + "_" + Date.now();
            localStorage.setItem('deviceId', deviceId);
        }
        return deviceId;
    }, []);


    // CLEAR AUTH. STATE to remove stored "user" details from local storage. Useful for logout.
    const clearAuthState = useCallback(()=>{
        localStorage.removeItem('user');
        setUser(null);
    }, []);


    // HANDLE AUTHENTICATION FAILURE. Clear auth state and redirect to the "/login-register" page
    const handleAuthFailure = useCallback(()=>{
        clearAuthState();
        return <Navigate to="/login-register" replace />
    }, [clearAuthState]);   // [clearAuthState] is the function's dependency list


    // REFRESH-TOKEN: sends "refresh token" to server when access token has expired to generate new sets of tokens
    const refreshToken = useCallback(async()=>{
        if(isRefreshingRef.current && refreshPromiseRef.current){
            // isRefreshingRef.current is "false", refreshPromiseRef.current is "null". i.e if "false" 
            // and "null" then call the "refreshPromiseRef.current" async function declared later below
            return refreshPromiseRef.current;   // async()=>{} function
        }

        isRefreshingRef.current = true; // change the isRefreshingRef.current to "true"
        setIsRefreshing(true);  // refreshing is in progress i.e. "isRefreshing" is now "true"

        refreshPromiseRef.current = (async()=>{
            try{
                const response = await fetch(`${baseURLRef.current}/api/auth//refresh-token`, {
                    method: "POST",
                    credentials: "include",    // this include the "refreshjwt" cookie header
                    headers: {
                        "Content-Type": "application/json"
                    }
                    // body is not required here since "refreshjwt" cookie is being sent
                });

                if(response.ok){
                    console.log("Token refresh successful.");
                    return true;
                } else{
                    // call "handleAuthFailure()" function which clears auth state and redirect to 
                    // the "/login" page for user to login again.
                    handleAuthFailure();
                    return false;
                }
            }catch(error){
                console.error("Token refresh error. ", error)
                handleAuthFailure();
                return false
            }finally{
                // After executing the try/catch block, do the following
                isRefreshingRef.current = false; // change the isRefreshingRef.current back to "false"
                setIsRefreshing(false);  // refreshing is stopped i.e. "isRefreshing" is now "false"
                refreshPromiseRef.current = null // // change the refreshPromiseRef.current back to "null"
            }
        })();  // the second brackets "()" executes the async function in the first bracket immediately 
        
        return refreshPromiseRef.current;
    }, [handleAuthFailure]);


    // BACKGROUND TOKEN REFRESH Does not affect the UI (i.e. non-blocking)
    const refreshTokenInBackground = useCallback(()=>{
        // if refreshing is true or required, run the "refreshToken()" function in the if block.
        // !isRefreshingRef.current evaluates to "true" since isRefreshingRef.current is "false" initially
        if(!isRefreshingRef.current){
            // calls and fires the async "refreshToken()" function and catch the error without waiting 
            // for the response of the function. This does not affect the UI i.e. runs in background
            refreshToken().catch(error=>{
                console.error('Background token refresh failed: ', error);
            });
        }
    }, [refreshToken]);    


    // ENHANCED FETCH for pages that requires authentication or automatic token refresh at the 
    // backend e.g. "dashboard"
    const authenticatedFetch = useCallback(async(fetchUrl, fetchOptions = {}) => {
        // if the fetchUrl starts with "http" (e.g. http://localhost:4000), then use it. Otherwise
        // join the fetchUrl to the back of the baseURLRef.current value 
        const fullUrl = fetchUrl.startsWith('http') ? fetchUrl : `${baseURLRef.current}${fetchUrl}`;
        // unpack the fetchOptions object parameter that will be passed to the authenticatedFetch()
        // function call to create the full "request options" object.
        const requestOptions = {
            ...fetchOptions,    // unpacks the fetchOptions object but does not include nested object
            credentials: 'include',     // adds the tokens cookies header
            headers: {
                "Content-Type": "application/json",
                ...fetchOptions.headers     // unpack the nested "headers" object in "fetchOptions"
            }
        }
        try {
            // calls the main javascript "fetch()" api method
            let response = await fetch(fullUrl, requestOptions); 

            // check if access token refresh "X-..." is added in the response header by the server
            if(response.headers.get("X-Token-Refresh-Required") === "true"){
                console.log("Background token refresh triggered");
                refreshTokenInBackground();
            }
            // handle expired token
            if(response.status === 401){    // 401 = UNAUTHORIZED
                const errorData = await response.clone().json().catch(()=>({}));

                if(errorData.error_message === "Token Expired"){
                    console.log("Access token expired, attempting refresh...");
                    // call the refreshToken() function to generate a new set of token from the API
                    const refreshSuccess = await refreshToken();

                    // if token refresh is successful, reconnect with the new set of token
                    if(refreshSuccess){
                        response = await fetch(fullUrl, requestOptions);
                    }else{
                        // token refresh failed, user needs to login again
                        alert("Authentication failed. Please login again.");
                        return <Navigate to="/login-register" replace />
                    }
                }
            }
            return response;
        } catch (error) {
            console.error("Authentication fetch error. ", error);
            throw error;
        }
    }, [refreshToken, refreshTokenInBackground]);

    
    // REGISTER
    const register = useCallback(async(formFieldInput) => {
        // using Content-Type "application/json" since server refuses "multipart/form-data" for "FormData".
        // The Content-Type is NOT set by the browser, it MUST be set manually.           
        try {      
          const response = await fetch(`${baseURLRef.current}/api/auth/register`, {
            method: "POST", // credentials: 'include', is not needed during registration.
            headers: {
              "Content-Type": "application/json",     // must be set manually to prevent error
            },
            body: JSON.stringify(formFieldInput)
          });
        
          const data = await response.json();

          if(!response.ok){
            if(Array.isArray(data.error_message)){
                const arrayError = data.error_message[0];
                alert(arrayError.msg);
                return false;
            }
            else{
                alert(data.error_message);
                return false;
            }           
          }
              
          if(data.success){            
            alert(`${data.message}. Kindly login to continue. Your details are: \n Username: ${data.user.username}, \n Email: ${data.user.email}`);                       
            return true;
          }
        }catch(error){
            console.error("Error: ", error)
        } 
    }, []);   
    

    // LOGIN
    const login = useCallback(async(formInputData)=> {
        try {
              const response = await fetch(`${baseURLRef.current}/api/auth/login`, {
                method: "POST",   
                credentials: 'include',
                headers: {
                  // "Content-Type": "application/x-www-form-urlencoded",   // optional, set by browser
                  Accept: "application/json",
                },
                body: formInputData,
              });
        
              const data = await response.json();
              
              if(!response.ok){
                if(Array.isArray(data.error_message)){
                    const arrayError = data.error_message[0];
                    alert(arrayError.msg);
                    return false;
                }
                else{
                    alert(data.error_message);
                    return false;
                }           
              }
              
              if(data.success){
                localStorage.setItem('user', JSON.stringify(data.user));
                setUser(data.user);  // user is now an object with value. isAuthenticated becomes "true"
                alert(`${data.message}. You are signed in as "${data.user.username}"`);
                return true;
              }
            }catch(error){
                console.error("Error: ", error);
            }    
    }, []);


    // LOGOUT
    const logout = useCallback(async()=> {
        try {
            // uses refresh token which is invaliidated until user login again.

            const confirm = window.confirm("It's been wonderful having you onboard. Are you sure you want to logout now?")
            
            if(!confirm){
                return;     // return if false
            }
            
            const response = await fetch(`${baseURLRef.current}/api/auth/logout`, {
                method: "POST",   
                credentials: 'include',         // for sending cookiea
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            });
    
            const data = await response.json();
            
            if(!response.ok){
                alert(data.error_message);
                return false;           
            }
            
            if(data.success){
                alert(data.message);
                clearAuthState(); // removes user from localStorage. setUser to "null" making 
                // isAuthenticated to become false..
                return true;
            }
        }catch(error){
            console.error("Error: ", error)
        }    
    }, [clearAuthState]);


    // LOGOUT FROM ALL DEVICES
    const logoutAll = useCallback(async()=> {
        try {
            
            const confirm = window.confirm("Are you sure you want to logout now? Your cart will be cleared.")
            
            if(!confirm){
                return;
            }

            const response = await fetch(`${baseURLRef.current}/api/auth/logout-all`, {
                method: "POST",
                credentials: 'include',         // for sending cookiea
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },               
            });
    
            const data = await response.json();
            
            if(!response.ok){
                alert(data.error_message)
                return false;            
            }
            
            if(data.success){
                alert(data.message);
                clearAuthState();   // removes user from localStorage. setUser to "null" making 
                // isAuthenticated to become false.
                return true;
            }
        }catch(error){
            console.error("Error: ", error)
        }    
    }, [clearAuthState]);

    // CHANGE PASSWORD
        const updatePassword = useCallback(async(formFieldInput) => {
            // using Content-Type "application/json" since server refuses "multipart/form-data" for "FormData".
            // The Content-Type is NOT set by the browser, it MUST be set manually.           
            try {      
              const response = await fetch(`${baseURLRef.current}/api/auth/change-password`, {
                method: "POST", 
                credentials: 'include',
                headers: {
                  "Content-Type": "application/json",     // must be set manually to prevent error
                },
                body: JSON.stringify(formFieldInput),
              });
            
                const data = await response.json();
                
              if(!response.ok){
                if(Array.isArray(data.error_message)){
                    const arrayError = data.error_message[0];
                    alert(arrayError.msg);
                    return false;
                }
                else{
                    alert(data.error_message);
                    return false;
                }           
              }
                  
              if(data.success){
                alert(`${data.message}. Kindly login with your new password to continue.`);
                return true;
              }            
            }catch(error){
                console.error("Error: ", error)
            } 
        }, []);   


    // GET CURRENT
    const getCurrentUser = useCallback(()=>{
        try {
          const user = localStorage.getItem('user'); // isAuthenticated become "true" if user is found
          const parseUser = user ? JSON.parse(user) : null;
          return parseUser;
        } catch (error) {
          return null;
        }
    }, []);


    // Initialize "setUser" auth state once component is mounted. isAuthenticated becomes "true"
    // once a user is found in the localStorage
     useEffect(()=>{
        const currentUser = getCurrentUser();
        setUser(currentUser);
    }, [getCurrentUser]);

    const contextValue = {
        // states
        user,
        // loading,
        isRefreshing,
        isAuthenticated: !!user,    // is Authenticated is "false", until a user is created after 
                                    // login or existing user is found in localStorage
        // methods
        refreshToken,
        generateDeviceId,
        authenticatedFetch,
        register,
        login,
        logout,
        logoutAll,
        updatePassword,
        getCurrentUser
    }

    // use "{props.children}" below if "props" is used as parameter i.e. AuthContextProvider(props) 
    return(
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
}


export {useAuthContext, AuthContextProvider}