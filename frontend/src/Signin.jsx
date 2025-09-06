import { useState } from 'react';
import "./signin.css"

export default function Signin(){

  const [formData, setFormData] = useState({ user: '', password: '' });

  //updates the form's data based on input
  function handleChange(event){
    setFormData( {...formData, [event.target.name]: event.target.value}  )
  }

  // function handleSubmit(event){
  // }

  return ( 
    // <form onSubmit={handleSubmit}>
    <div className='signin'>
      <form >
          <label htmlFor="user"> Username: </label>
          <input type="text" id="user" name="user" value={formData.username} onChange={handleChange} required/>

          <label htmlFor="password"> Password: </label>
          <input type="password" id="password" name="password" value={formData.username} onChange={handleChange} required/>

          <button type="submit">Sign in</button>
      </form>
    </div>
  )
}