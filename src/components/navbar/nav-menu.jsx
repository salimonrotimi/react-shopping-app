import React, { useRef, useState } from 'react';
import "./nav-menu.css";
import cart_logo from "../assets/shopping-cart.png";
import mall_logo from "../assets/shop-logo.png";
import menu_icon from "../assets/menu.png";
import menu_close_icon from "../assets/menu-close.png";
import dropdown_icon from '../assets/dropdown-icon.png';
import arrowup_icon from '../assets/arrow-up-icon.png';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/auth-context';
import { useShopContext } from '../../context/shop-context';

function NavMenu() {  
  // calls the "getTotalCartItems" function in the "shop-context.jsx" file and the "logout" function in
  // "auth-context.jsx" file
  const {getTotalCartItems } = useShopContext();
  const {logout, logoutAll} = useAuthContext();
  const navigateTo = useNavigate();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef();    // create a reference to the <ul> tag that will be toggled by the 
  // <img> tag using the "toggleDropdown()" function.

  const [menu, setMenu] = useState("home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);  // isMenuOpen is initially "false". This 
  // helps to load the two images using one <img> tag.

  const menuRef = useRef();   // create a reference to the <ul> tag that will be toggled by the 
  // <img> tag using the "toggleMenu()" function.

  //  "e" is the event which points to the tag that uses the function i.e. the <img> menu tag
  const toggleMenu = (e) => {
    if(menuRef.current){    // "menuRef.current" points to the <ul> tag
      setIsMenuOpen(!isMenuOpen);    // set "isMenuOpen" to true. 
      menuRef.current.classList.toggle('nav-menu-visible'); // Attachs a "toggle" classlist to the 
      // menuRef.current (i.e. <ul>) element. "nav-menu-visible" must be set in the nav-menu.css file.
    }
  }

  const toggleDropdown = () => {
    if(dropdownRef.current){
      setIsDropdownOpen(!isDropdownOpen);
      dropdownRef.current.classList.toggle("nav-dropdown-visible");
    }
  }

  const handleLogout = async() =>{
    const logout_status = await logout();

    if(logout_status === true){
      navigateTo("/login-register", {replace: true});
    }
    else{
      return;
    }    
  }

  const handleLogoutAll = async() =>{
    const logout_all_status = await logoutAll();

    if(logout_all_status === true){
      dropdownRef.current.classList.toggle("nav-dropdown-close"); // closes the dropdown
      window.location.reload(); // refreshes the page and clear all recors while logging out.
      navigateTo("/login-register");
    }
    else{
      return;
    }
    
  }

  return (
    <div className='navbar'>
      <div className='nav-logo'>
        <img src={mall_logo} alt="Shopping mall logo" />
        <p>Shopping Mall</p>
      </div>

      <img className='nav-menu-icon' 
            src={isMenuOpen ? menu_close_icon : menu_icon} alt="" 
            onClick={toggleMenu} />
      <ul ref={menuRef} className='nav-menu-list'>
        <li onClick={() => setMenu("home") }>
          <Link to='/' style={{color: "black"}}>Home</Link>
          {menu === "home" ? <hr/> : <></>}
        </li>
        <li onClick={() => setMenu("men")}>
          <Link to='/men-collections' style={{color: "black"}}>Men</Link> 
          {menu === "men" ? <hr/> : <></>}
        </li>
        <li onClick={() => setMenu("women")}>
          <Link to='/women-collections' style={{color: "black"}}>Women</Link> 
          {menu === "women" ? <hr/> : <></>}
        </li>
        <li onClick={() => setMenu("kids")}>
          <Link to='/kids-collections' style={{color: "black"}}>Kids</Link> 
          {menu === "kids" ? <hr/> : <></>}
        </li>
        <li onClick={() => setMenu("couples")}>
          <Link to='/couples-collections' style={{color: "black"}}>Couples</Link> 
          {menu === "couples" ? <hr/> : <></>}
        </li>
      </ul>
      
      <div className='nav-login'>        
        <Link to='/cart' className='cart-image'><img src={cart_logo} alt='Cart logo' /></Link>
        <div className="cart-counter">{getTotalCartItems()}</div>
        <div>
          <div className='nav-login-link'>
            {localStorage.getItem('user') 
            ? <div className="toggle-logout">
                  <span onClick={handleLogout}>Logout</span>
                  <img src={isDropdownOpen ? arrowup_icon : dropdown_icon} 
                        onClick={toggleDropdown}
                        alt='' 
                        className='dropdown-icon' />
              </div>
            : <Link to='/login-register' className='login-register-btn'><button>Login</button></Link>
            }
          </div>
          <ul ref={dropdownRef} className='nav-dropdown-list'>
            <li onClick={handleLogoutAll}>
              <span>Logout All</span>
            </li>
          </ul>
        </div>       
      </div>
    </div>
  )
}

export default NavMenu