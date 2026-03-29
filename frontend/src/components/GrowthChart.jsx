import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend } from "recharts";
import "./GrowthChart.css";

const GrowthChart = ({ growth }) => {
  if (!growth) return null;

  const skills = Object.keys(growth);
  if (skills.length === 0) return null;

  const dates = [...new Set(growth[skills[0]].map(r => r.date))];
  const chartData = dates.map(date => {
    let obj = { date };
    skills.forEach(skill => {
      const rec = growth[skill].find(r => r.date === date);
      obj[skill] = rec ? rec.hours : 0;
    });
    return obj;
  });

  return (
    <div className="chart-container">
      <h2>Skill Growth Over Time</h2>
      <LineChart width={700} height={350} data={chartData}>
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        {skills.map(skill => (
          <Line key={skill} type="monotone" dataKey={skill} stroke="#4f46e5" strokeWidth={2} />
        ))}
      </LineChart>
    </div>
  );
};

export default GrowthChart;