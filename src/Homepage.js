import React, { useState } from 'react';
import {useNavigate} from 'react-router-dom';

const Homepage = () => {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handleStartClick = ()=>{
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        if(email.trim() !== '' && emailRegex.test(email)){
            navigate('/quiz');
        }else{
            alert('Please enter a valid email address');
        }
    }
    return(
        <div className='homepage-container'>
            <div className='homepage'>
            <h1>Quiz App</h1>
            <div className="email-box">
                <input
                    type="email"
                    placeholder='Enter your email address'
                    value={email}
                    onChange={(e)=> setEmail(e.target.value)}
                />
                <div className='start-button'>
                    <button type="submit" onClick={handleStartClick}>Start</button>
                </div>
            </div>
            </div>
        </div>
    )
}

export default Homepage;