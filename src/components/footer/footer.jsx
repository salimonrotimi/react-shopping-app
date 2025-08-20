import React from 'react'
import './footer.css'
import footer_logo from '../assets/shop-logo.png'
import { Link } from 'react-router-dom'
import fb_icon from '../assets/fb-transparent.png'
import ig_icon from '../assets/ig-transparent.png'
import skype_icon from '../assets/skype-transparent.png'
import twitter_icon from '../assets/twitter-transparent.png'


function Footer(){
    const presentYear = new Date().getFullYear();

    return(
        <div className='footer'>
            <div className='footer-logo'>
                <img src={footer_logo} alt='Footer logo'/>
                <p>Shopping Mall</p>
            </div>
            <ul>
                <li><Link to='/' className='footer-links'>Home</Link></li>
                <li><Link to='/product' className='footer-links'>Products</Link></li>
                <li>Offices</li>
                <li><Link to='/about' className='footer-links'>About</Link></li>
                <li>Contact Us</li>
            </ul>
            <div className="social-links">
                    <Link to="https://facebook.com" className='links' target='blank'>
                        <img src={fb_icon} alt="Facebook link"/> 
                        <span>Facebook</span>
                    </Link>
                    <Link to="https://instagram.com" className='links' target='blank'>
                        <img src={ig_icon} alt="Instagram link"/> 
                        <span>Instagram</span>
                    </Link>
                    <Link to="https://skype.com" className='links' target='blank' >
                        <img src={skype_icon} alt="Skype link"/> 
                        <span>Skype</span>
                    </Link>                
                    <Link to="https://twitter.com" className='links' target='blank'>
                        <img src={twitter_icon} alt="Twitter link"/> 
                        <span>Twitter</span>
                    </Link>
            </div>
            <hr/>
            <div className="copyright">
                <p>&#169; {presentYear} Shield Inc</p>
            </div>
        </div>
    )
}

export default Footer