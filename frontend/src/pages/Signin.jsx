import { useState } from 'react';
import "../styles/signin.css";

export default function Signin(){
  const [formData, setFormData] = useState({ user: '', password: '' });

  //updates the form's data based on input
  function handleChange(event){
    setFormData( {...formData, [event.target.name]: event.target.value} )
  }

  return ( 
    <div className='signin'>
      <form >
          <div className='username'>
            <label htmlFor="user"> Username: </label>
            <input type="text" id="user" name="user" value={formData.username} onChange={handleChange} placeholder="Email Address" required/>
          </div>

          <div className='password'>
            <label htmlFor="password"> Password: </label>
            <input type="password" id="password" name="password" value={formData.username} onChange={handleChange} placeholder="Password"required/>
          </div>

          <button type="submit">Sign in</button>
      </form>
    </div>
  )
}