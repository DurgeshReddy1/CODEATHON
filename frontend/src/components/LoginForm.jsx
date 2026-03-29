import React, { useState } from "react";
import { loginUser } from "../Api.jsx";
import "./LoginForm.css";
const LoginForm = ({setUserId})=>{
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");

  const handleSubmit=async(e)=>{
    e.preventDefault();
    const res = await loginUser(email,password);
    if(res.user_id)setUserId(res.user_id);
    else alert(res.error);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} type="email" required/>
      <input placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} type="password" required/>
      <button type="submit">Login</button>
    </form>
  )
}

export default LoginForm;