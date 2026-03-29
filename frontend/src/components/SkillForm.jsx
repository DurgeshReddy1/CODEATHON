import React, { useState } from "react";
import { allocateSkills } from "../Api.jsx";
import "./SkillForm.css";

const SkillForm = ({userId,setAllocations})=>{
  const [skills,setSkills]=useState({Python:3,"Machine Learning":2,JavaScript:3,React:2});
  const [hours,setHours]=useState(10);

  const handleChange=(e,skill)=>{
    setSkills({...skills,[skill]:parseInt(e.target.value)});
  }

  const handleSubmit=async(e)=>{
    e.preventDefault();
    const res = await allocateSkills(userId,skills,hours);
    setAllocations(res.allocations);
  }

  return (
    <form onSubmit={handleSubmit}>
      {Object.keys(skills).map(skill=>(
        <div key={skill}>
          <label>{skill} Level:</label>
          <input type="number" min="1" max="5" value={skills[skill]} onChange={e=>handleChange(e,skill)} />
        </div>
      ))}
      <div>
        <label>Available Hours/Week:</label>
        <input type="number" value={hours} onChange={e=>setHours(parseInt(e.target.value))} />
      </div>
      <button type="submit">Allocate</button>
    </form>
  )
}

export default SkillForm;