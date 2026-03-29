import React from "react";
import "./ChatBox.css";

const ChatBox = ({ allocations, predictions }) => {
  return (
    <div className="chatbox-container">
      <h3>AI Advisor Recommendations</h3>
      {allocations?.map((a, i) => (
        <p key={i} className="recommendation">💡 {a.advice}</p>
      ))}
      <h3>Predictions for Future Weeks</h3>
      {predictions?.map((p, i) => (
        <p key={i} className="prediction">📈 {p.skill}: {p.predicted_hours} hrs - {p.reasoning}</p>
      ))}
    </div>
  );
};

export default ChatBox;