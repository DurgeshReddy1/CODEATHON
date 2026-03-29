import React, { useState, useEffect } from "react";
import RegisterForm from "./components/RegisterForm.jsx";
import LoginForm from "./components/LoginForm.jsx";
import SkillForm from "./components/SkillForm.jsx";
import AllocationTable from "./components/AllocationTable.jsx";
import AllocationChart from "./components/AllocationChart.jsx";
import GrowthChart from "./components/GrowthChart.jsx";
import ChatBox from "./components/ChatBox.jsx";
import { getGrowthPrediction } from "./Api.jsx";
import "./App.css";

function App() {
  const [userId, setUserId] = useState(null);
  const [allocations, setAllocations] = useState(null);
  const [growth, setGrowth] = useState(null);
  const [predictions, setPredictions] = useState(null);

  useEffect(() => {
    if (userId && allocations) {
      getGrowthPrediction(userId).then((res) => {
        setGrowth(res.growth);
        setPredictions(res.predictions);
      });
    }
  }, [userId, allocations]);

  /* ================= AUTH PAGE ================= */
  if (!userId) {
    return (
      <div className="page-container">
        <h1>Investment Portfolio Engine</h1>

        <div className="main-content">
          <div className="card form-container">
            <h2>Register</h2>
            <RegisterForm setUserId={setUserId} />
          </div>

          <div className="card form-container">
            <h2>Login</h2>
            <LoginForm setUserId={setUserId} />
          </div>
        </div>
      </div>
    );
  }

  /* ================= MAIN DASHBOARD ================= */
  return (
    <div className="page-container">
      <h1>Skill Investment Portfolio Engine</h1>

      {/* FORM */}
      <div className="card form-container">
        <SkillForm userId={userId} setAllocations={setAllocations} />
      </div>

      {/* DASHBOARD */}
      {allocations ? (
        <>
          {/* CHARTS */}
          <div className="main-content">
            <div className="card chart-container">
              <h3>Skill Allocation</h3>
              <AllocationChart allocations={allocations} />
            </div>

            <div className="card chart-container">
              <h3>Skill Growth</h3>
              <GrowthChart growth={growth} />
            </div>
          </div>

          {/* TABLE */}
          <div className="card">
            <h3>Portfolio Allocation</h3>
            <AllocationTable allocations={allocations} />
          </div>

          {/* AI CHAT */}
          <div className="card chatbox-container">
            <h3>🤖 AI Advisor</h3>
            <ChatBox allocations={allocations} predictions={predictions} />
          </div>
        </>
      ) : (
        <p className="placeholder-text">
          Submit your skills above to see allocations, growth, and AI recommendations.
        </p>
      )}
    </div>
  );
}

export default App;