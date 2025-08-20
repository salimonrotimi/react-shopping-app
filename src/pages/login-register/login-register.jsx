import React, {useState, useMemo} from 'react';
import './login-register.css';
import { useAuthContext } from '../../context/auth-context';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { inputSanitizer } from '../../utils-security/input-security';
import { validateFormRegister, validateFormLogin } from '../../utils-security/form-validator';
import toast from "react-hot-toast"; // install with npm, add the "Toaster" component and its properties
// <Toaster position="top-center" reverseOrder={false}/> under the <BrowserRouter> in App.jsx


function LoginRegister() {
  const {generateDeviceId, register, login} = useAuthContext();
  const [pageState, setPageState] = useState('Login');
  const [isChecked, setIsChecked] = useState(false);    // isChecked is initially set to "false"
  const [formField, setFormField] = useState({
    username: "",
    email: "",
    password: "",
    confirm_password: ""
  });
 
  // Get the page the user was trying to visit before being redirected to login from the <ProtectedRoute/>
  const location = useLocation();
  const navigateTo = useNavigate();
  
  // The "useMemo" help to prevent continuous re-rendering of the location by memorizing it at once.
  const from = useMemo(()=>{
    return location.state?.from?.pathname || "men-collections"
  }, [location.state?.from?.pathname]);

  // call the "generateDeviceId" function (that create the Id and save it localStorage) from "useAuthContext"
  // get the "deviceId" from the "generateDeviceId" function. To be used in login.
  const deviceId = generateDeviceId()

  const handleChecked = (event) => {  // for the checkbox
    setIsChecked(event.target.checked)
  }

  const handleChange = (event) => {
    const {name, value} = event.target;

    let sanitizedValue; 
    // Exclude users password from sanitization as it changes the password into something different.
    if(name === "password" || name === "confirm_password"){
      sanitizedValue = value;
    }
    else{
      sanitizedValue = inputSanitizer(value);
    }    
    setFormField({...formField, [name]: sanitizedValue})
  }

  const passwordMatch = formField.password === formField.confirm_password && formField.password !== '' && formField.confirm_password !== '';
  // OR const isMatch = formField.password === formField.confirm_password && formField.password && formField.confirm_password;

  if(passwordMatch){
    toast.success("Passwords matched."); 
  }

// SIGNUP/REGISTER
  const signupApi = async(e) => {
    e.preventDefault();

    const {username, email, password, confirm_password} = formField;

    if(!username || !email || !password || !confirm_password){
        alert('Please fill all fields to continue.')
        return;
    }

    const errors = validateFormRegister(formField); // get all the errors from the imported "validateForm()""

    // Get all the keys with errors from the "errors" variable. Its length will be zero if no error.
    if (Object.keys(errors).length > 0) {
      Object.values(errors).forEach((error) => {
        toast.error(error);
      });
      return;
    }
    else {
      // if newErrors length is zero or less, toast success message
      toast.success("Form inputs are valid.");  
    }  

    const register_status = await register(formField);

    if(register_status === true){
      window.location.reload(); // refreshes the page
      navigateTo('/login-register', {replace: true}); // If registration is successful, redirect user 
      // to the login page for authentication. Else, remain on the register page. 
    }
    else{
      return;
    }
  }


  // LOGIN
  const loginApi = async(e) => {
    e.preventDefault();
    
    const {email, password} = formField;
    // const loginData = {email, password}    // for JSON.stringify(loginData)
  
    if(!email || !password){
      alert('Please fill all fields to continue.')
      return;
    }

    const errors = validateFormLogin(formField); // get all the errors from the imported "validateForm()""

    // Get all the keys with errors from the "errors" variable. Its length will be zero if no error.
    if (Object.keys(errors).length > 0) {
      Object.values(errors).forEach((error) => {
        toast.error(error);
      });
      return;
    }
    else{
      // if newErrors length is zero or less, toast success message
      toast.success("Form inputs are valid."); 
    }

    //    Using Content-Type "application/x-www-form-urlencoded" for "URLSearchParams" since server 
    // refuses "multipart/form-data" for "FormData". The content-type is set by the browser by default
    //    Content-Type: "application/json" can also be used, which must be set manually, and the body
    // value must be json stringified e.g. JSON.stringify(loginData)
    const formBody = new URLSearchParams();
    formBody.append('email', email);
    formBody.append('password', password);
    formBody.append('deviceId', deviceId);

    const login_status = await login(formBody);
    
    if(login_status === true){
      navigateTo(from, {replace: true}); // If already authenticated, redirect to the page the user
      // was trying to visit initially before being redirected. 
    }
    else{
      return;
    }
  }
  
  return (
    <div className='login-register'>
      <div className="login-register-container">
        <h2>{pageState}</h2>

        <p className='instruction'>Kindly <span>{pageState}</span> to continue</p>

        <div className="login-register-fields">
          {pageState==='Sign Up'
           ?<p>
              <label htmlFor='username'>Username: </label>
              <input type='text' name='username' onChange={handleChange} placeholder='Enter your username'/>
            </p>
           :<></>
          }
          <p>
            <label htmlFor='email'>Email:</label>
            <input type='text' name='email' onChange={handleChange} placeholder='Enter your email'/>
          </p>
          <p>
            <label htmlFor='password'>Password: </label> 
            <input type='password' name='password' onChange={handleChange} placeholder='Enter your password'/>
          </p>
           {pageState==='Sign Up'
            ? <p>
                <label htmlFor='confirm_password'>Confirm Password: </label> 
                <input type='password' name='confirm_password' onChange={handleChange} placeholder='Re-enter your password'/>
              </p>
            : <></>
           }
          <div className="agree-terms">
            <input type="checkbox" checked={isChecked} onChange={handleChecked}/>
            <span>By continuing, I agree to terms of use and privacy policy.</span>
          </div>
          <p className='btn-center'>
            <button onClick={(pageState==="Login") ? loginApi : signupApi} disabled={!isChecked}>
              {pageState}
            </button>
          </p>
          <div className='center-text'>
            <div>Forget Password?
              <span className='center-login'>
                <Link to='/forgot-password' style={{color: "red"}}>Click here</Link>
              </span>
            </div>            
          </div>
          <div className='center-text'>
            {(pageState==='Sign Up')
             ?<div onClick={()=>setPageState('Login')}>Already have an account?<span className='center-login'>Login</span></div>
             :<div onClick={()=>setPageState('Sign Up')}>Don't have an account?<span className='center-reg'>Register</span></div>
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginRegister