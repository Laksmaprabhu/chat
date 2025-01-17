import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const StudentRegister = () => {
    const[name, setName] = useState('');
    const[username, setUsername] = useState('');
    const[password, setPassword] = useState('');
    const userdata = {
        name,
        username,
        password
    }
    const handleSubmit = (e) => {
        e.preventDefault();       
        axios.post('http://localhost:5000/studentregister',userdata)
        .then(response => {  
            setUsername(''); 
            setPassword('');            
        });
       
    }
    return(
        <div className='form-section'>
            <div className="mb-5">
            <h1>Register as Student</h1>
            </div>
        
            <form onSubmit={handleSubmit}>
            <div className="mb-3">                
                <input type="text" className="form-control" value={name} id="exampleInputname" aria-describedby="nameHelp" onChange={(e) => setName(e.target.value)}/>
            </div>
            <div className="mb-3">                
                <input type="email" className="form-control" value={username} id="exampleInputEmail1" aria-describedby="emailHelp" onChange={(e) => setUsername(e.target.value)}/>
            </div>
            <div className="mb-3">
                
                <input type="password" className="form-control" value={password} id="exampleInputPassword1"  onChange={(e) => setPassword(e.target.value)}/>
            </div>
           
            <button type="submit" className="btn btn-primary">Submit</button>
            </form>
            <br></br>
            Already have an account? <Link to="/student-login">Signin</Link>
        </div>
    )
}

export default StudentRegister;