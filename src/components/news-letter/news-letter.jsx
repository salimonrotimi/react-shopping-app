import React from 'react'
import './news-letter.css'

function NewsLetter() {
  return (
    <div className='news-letter'>
        <h1>Get exclusive offers through your email</h1>
        <p>Subscribe to outr news letter and stay updated.</p>
        <div className="subscribe">
            <input type='email' placeholder='Enter your email address'/>
            <button>Subscribe</button>
        </div>
    </div>
  )
}

export default NewsLetter