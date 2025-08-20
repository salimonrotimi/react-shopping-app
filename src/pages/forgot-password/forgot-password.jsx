import React, {useState} from 'react';
import './forgot-password.css';
import { useAuthContext } from '../../context/auth-context';
import { Link, useNavigate } from 'react-router-dom';
import { inputSanitizer } from '../../utils-security/input-security';
import { validateFormPassword } from '../../utils-security/form-validator';
import toast from "react-hot-toast"; // install with npm, add the "Toaster" component and its properties
// <Toaster position="top-center" reverseOrder={false}/> under the <BrowserRouter> in App.jsx


function ForgotPassword() {
  const navigateTo = useNavigate();
  const { updatePassword } = useAuthContext();
  const [formField, setFormField] = useState({
    email: "",
    password: "",
    confirm_password: "",
  });  

  const handleChange = (event) => {
      const {name, value} = event.target;
  
      let sanitizedValue; 
      // Exclude users password from sanitization as it changes the password into something different
      if(name === "password" || name === "confirm_password"){
        sanitizedValue = value;
      }
      else{
        sanitizedValue = inputSanitizer(value);
      }
      
      setFormField({...formField, [name]: sanitizedValue})
  }

  // "passwordMatch" enables the button whrn true and disablrs the button when false
  const passwordMatch = formField.password === formField.confirm_password && formField.password !== '' && formField.confirm_password !== '';
  // OR const isMatch = formField.password === formField.confirm_password && formField.password && formField.confirm_password;
  
  if(passwordMatch){
    toast.success("Password matched."); 
  }
 
  // FORGET PASSWORD
  const changePassword = async(e) => {
    e.preventDefault();

    const {email, password, confirm_password} = formField;

    console.log(email, '\n', password, '\n', confirm_password);

    if(!email || !password || !confirm_password){
        alert('Please fill all fields to continue.')
        return;
    }

    const errors = validateFormPassword(formField); // get all the errors from the imported "validateForm()""
    
    // Get all the keys with errors from the "errors" variable. Its length will be zero if no error.
    if (Object.keys(errors).length > 0) {
      Object.values(errors).forEach((error) => {
        toast.error(error);
      });
      return;
    }

    // if newErrors length is zero or less, toast success message
    toast.success("Form inputs are valid.");    

    if(passwordMatch){
      const password_status = await updatePassword(formField);
      if(password_status === true){
        navigateTo('/login-register', {replace: true});
      }else{
        return;
      }
    }
    else{
      alert('Password and Confirm-password field are not the same');
    }
  }
  
  return (
    <div className='forget-password'>
      <div className="forget-password-container">
        <h2>Change Password</h2>

        <div className="forget-password-fields">
          <p>
            <label htmlFor='email'>Email:</label>
            <input type='text' name='email' onChange={handleChange} placeholder='Enter your email'/>
          </p>
          <p>
            <label htmlFor='password'>Password: </label> 
            <input type='password' name='password' onChange={handleChange} placeholder='Enter your password'/>
          </p>
          <p>
            <label htmlFor='confirm_password'>Confirm Password: </label> 
            <input type='password' name='confirm_password' onChange={handleChange} placeholder='Re-enter your password'/>
          </p>
          <p className='forget-password-btn-center'>
            <button onClick={changePassword} disabled={!passwordMatch}>
              Submit
            </button>
          </p>
          <div className='forget-password-center-text'>
            <div>Back to
              <span className='forget-password-center-login'>
                <Link to='/login-register' style={{color:'red', textDecoration:"none"}}>Login</Link>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword