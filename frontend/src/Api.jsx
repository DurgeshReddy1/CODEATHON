export const registerUser = async (name,email,password)=>{
  const res = await fetch("http://localhost:5000/register",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({name,email,password})
  });
  return await res.json();
}

export const loginUser = async (email,password)=>{
  const res = await fetch("http://localhost:5000/login",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({email,password})
  });
  return await res.json();
}

export const allocateSkills = async (user_id,skills,hours)=>{
  const res = await fetch("http://localhost:5000/allocate",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({user_id,skills,hours})
  });
  return await res.json();
}

export const getGrowthPrediction = async(user_id)=>{
  const res = await fetch("http://localhost:5000/growth_prediction",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({user_id})
  });
  return await res.json();
}