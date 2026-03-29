import React from "react";
import {BarChart,Bar,XAxis,YAxis,Tooltip,Legend} from "recharts";
import "./AllocationChart.css";
const AllocationChart = ({allocations})=>{
  if(!allocations)return null;
  return (
    <BarChart width={600} height={300} data={allocations}>
      <XAxis dataKey="skill"/>
      <YAxis/>
      <Tooltip/>
      <Legend/>
      <Bar dataKey="hours" fill="#8884d8" name="Allocated Hours"/>
      <Bar dataKey="demand" fill="#82ca9d" name="Market Demand"/>
    </BarChart>
  )
}

export default AllocationChart;