import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUserData } from '../slices/studentSlice';

const StudentLogin = () => {
    const[username, setUsername] = useState('');
    const[password, setPassword] = useState('');
    const[message, setMessage] = useState('');
    const userdata = {
        username,
        password
    }
    const dispatch = useDispatch();
    const navigate = useNavigate();
   
    const handleSubmit = (e) => {
        e.preventDefault();       
        axios.post('http://localhost:5000/studentlogin',userdata)
        .then(response => {  
            if(response.data.message === 'valid'){
                console.log(response.data.userdata);
                dispatch(setUserData({
                    userId: response.data.userdata._id,
                    username: response.data.userdata.username,
                  }));
                navigate('/student');                
            }
            else{
                setMessage(response.data.message);
            }         
        });
       
    }
    
    return(
        <div className='login-section form-section'>
            <div className="mb-5">
            <h1>Login as Student</h1>
            </div>
        
            <form onSubmit={handleSubmit}>
            <div className="mb-3">
                
                <input type="email" className="form-control" value={username} id="exampleInputEmail1" aria-describedby="emailHelp" onChange={(e) => setUsername(e.target.value)}/>
            </div>
            <div className="mb-3">
                
                <input type="password" className="form-control" value={password} id="exampleInputPassword1"  onChange={(e) => setPassword(e.target.value)}/>
            </div>  
           <div class="validation-message">{message}</div>
           <div className='mb-3'>
            <button type="submit" className="btn btn-primary">Submit</button>
            </div>
            </form>
            <div className='mb-3'>
            Don't have an student account? <Link to="/student-register">Signup</Link>
            </div>
        </div>
    )
}

export default StudentLogin;