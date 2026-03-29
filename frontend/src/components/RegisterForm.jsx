import React, { useState } from "react";
import { registerUser } from "../Api.jsx";
import "./RegisterForm.css";
const RegisterForm = ({setUserId})=>{
  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");

  const handleSubmit=async(e)=>{
    e.preventDefault();
    const res = await registerUser(name,email,password);
    if(res.user_id)setUserId(res.user_id);
    else alert(res.error);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} required/>
      <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} type="email" required/>
      <input placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} type="password" required/>
      <button type="submit">Register</button>
    </form>
  )
}

export default RegisterForm;