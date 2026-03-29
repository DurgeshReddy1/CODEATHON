import React from "react";
import "./AllocationTable.css";
const AllocationTable = ({allocations})=>{
  if(!allocations)return null;
  return (
    <table border="1">
      <thead>
        <tr>
          <th>Skill</th><th>Level</th><th>Hours</th><th>Demand</th><th>Risk</th><th>Advice</th>
        </tr>
      </thead>
      <tbody>
        {allocations.map(a=>(
          <tr key={a.skill}>
            <td>{a.skill}</td>
            <td>{a.level}</td>
            <td>{a.hours}</td>
            <td>{a.demand}</td>
            <td>{a.risk}</td>
            <td>{a.advice}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default AllocationTable;