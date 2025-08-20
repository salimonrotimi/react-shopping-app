import React from 'react'
import { useAuthContext } from '../context/auth-context'
import { Navigate, useLocation } from 'react-router-dom'


const ProtectedRoute = ({children}) => {
  const {isAuthenticated} = useAuthContext();   // isAuthenticated is !!user i.e. "false" in 
  // useAuthContext() in this case provided user has not been created for localStorage through login.

  // For saving the url the user want to visit before being redirected to login by the <ProtectedRoute>.
  // This saved "location" is retrieved in any partcular page using "location.state?.from?.pathname"
  // from the route path i.e. <Route path="" /> by the <ProtectedRoute> tag placed as "element" inside 
  // the
  const location = useLocation();  // means get the location from the <Route/> tag.
  
  //if true (!false i.e. user is not authenticated) then redirect to the login-register page.
  if(!isAuthenticated){ 
    return <Navigate to="/login-register" state={{from: location}} replace />
  }
  // otherwise
  return children;      // return props.children;  if (props) is used as the function parameter.
  // children refers to whatever component tag is inside the <ProtectedRoute></ProtectedRoute> tag
}

export default ProtectedRoute