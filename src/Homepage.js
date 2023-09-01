import React, { useState } from 'react';
import {useNavigate} from 'react-router-dom';

const Homepage = () => {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handleStartClick = ()=>{
        if(email.trim() !== ''){
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
                    placeholder='enter your email address'
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