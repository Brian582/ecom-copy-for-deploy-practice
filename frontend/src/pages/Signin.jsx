import { useState } from 'react';
import "../styles/signin.css";
import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from '../Context.jsx';
import { useNavigate } from 'react-router-dom';

export default function Signin(){
  const { login, user } = useContext(AuthContext);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  //updates the form's data based on input
  function handleChange(event){
    setFormData( {...formData, [event.target.name]: event.target.value} )
  }

  //handles form data after submission
  async function handleSubmit(event){
    try {
      
      event.preventDefault();// prevents page reload
      const response = await axios.post("http://localhost:5000/getUser", formData);
      const user_data = response.data
      login( user_data["username"] , user_data["authenticated"] )//sets user's name and authentication status

      //checks if user is authenticated
      if (user_data["authenticated"] == true) { 
        console.log("Login successful")
        navigate('/') 
      }
      else {console.log("Login failed")}

    } catch (error) {
      console.error('Error:', error);
    }
  }

  return ( 
    <div className='signin'>
      <form onSubmit={handleSubmit}>
          <div className='username'>
            <label htmlFor="username"> Username: </label>
            <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} placeholder="Email Address" required/>
          </div>

          <div className='password'>
            <label htmlFor="password"> Password: </label>
            <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password"required/>
          </div>

          <button type="submit">Sign in</button>
      </form>
    </div>
  )
}