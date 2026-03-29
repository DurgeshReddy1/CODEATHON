from flask import Flask, request, jsonify
from flask_cors import CORS
from models import init_db, session, User, Skill, MarketDemand, AllocationHistory
from datetime import datetime

app = Flask(__name__)
CORS(app)
init_db()

# Seed market demand data
def seed_market_data():
    data = [
        {"skill_name": "Python", "demand_score": 5, "risk_level": "Low"},
        {"skill_name": "JavaScript", "demand_score": 4, "risk_level": "Low"},
        {"skill_name": "Machine Learning", "demand_score": 5, "risk_level": "Medium"},
        {"skill_name": "React", "demand_score": 3, "risk_level": "Medium"},
    ]
    for item in data:
        if not session.query(MarketDemand).filter_by(skill_name=item["skill_name"]).first():
            md = MarketDemand(**item)
            session.add(md)
    session.commit()

seed_market_data()

# ------------------- User Registration & Login -------------------
@app.route("/register", methods=["POST"])
def register():
    data = request.json
    if session.query(User).filter_by(email=data["email"]).first():
        return jsonify({"error": "Email already exists"}), 400
    user = User(name=data["name"], email=data["email"])
    user.set_password(data["password"])
    session.add(user)
    session.commit()
    return jsonify({"message": "User registered successfully", "user_id": user.id})

@app.route("/login", methods=["POST"])
def login():
    data = request.json
    user = session.query(User).filter_by(email=data["email"]).first()
    if user and user.check_password(data["password"]):
        return jsonify({"message": "Login successful", "user_id": user.id})
    return jsonify({"error": "Invalid email or password"}), 401

# ------------------- Allocation Logic -------------------
def allocate_skills(user_id, user_skills, total_hours=10):
    market = {md.skill_name: md.demand_score for md in session.query(MarketDemand).all()}
    risk = {md.skill_name: md.risk_level for md in session.query(MarketDemand).all()}

    history = session.query(AllocationHistory).filter_by(user_id=user_id).all()
    history_map = {h.skill_name: h.allocated_hours for h in history}

    scores = {}
    for skill, level in user_skills.items():
        demand = market.get(skill, 1)
        past = history_map.get(skill, 0)
        score = demand * (5 - level) + max(0, 3 - past)
        scores[skill] = score

    total_score = sum(scores.values())
    allocation = {skill: round(total_hours * scores[skill] / total_score, 1) for skill in scores}

    for skill, hours in allocation.items():
        session.add(AllocationHistory(user_id=user_id, skill_name=skill, allocated_hours=hours))
    session.commit()

    result = []
    for skill in allocation:
        advice_line = ""
        if allocation[skill] > 3:
            advice_line = f"Focus more on {skill}. High demand and potential reward."
        elif allocation[skill] <= 2:
            advice_line = f"Reduce time in {skill}. Current skill sufficient or lower market demand."
        else:
            advice_line = f"Maintain {skill}. Balanced allocation."
        result.append({
            "skill": skill,
            "level": user_skills[skill],
            "hours": allocation[skill],
            "demand": market.get(skill,1),
            "risk": risk.get(skill,"Low"),
            "advice": advice_line
        })
    return result

@app.route("/allocate", methods=["POST"])
def allocate():
    data = request.json
    user_id = data["user_id"]
    user_skills = data["skills"]
    total_hours = data.get("hours", 10)
    allocations = allocate_skills(user_id, user_skills, total_hours)
    return jsonify({"allocations": allocations})

# ------------------- Skill Growth + Prediction -------------------
def get_growth(user_id):
    history = session.query(AllocationHistory).filter_by(user_id=user_id).order_by(AllocationHistory.created_at).all()
    growth = {}
    for h in history:
        if h.skill_name not in growth:
            growth[h.skill_name] = []
        growth[h.skill_name].append({"date": h.created_at.strftime("%Y-%m-%d"), "hours": h.allocated_hours})
    return growth

def predict_future(user_id, weeks=4):
    growth = get_growth(user_id)
    market = {md.skill_name: md.demand_score for md in session.query(MarketDemand).all()}
    predictions = []
    for skill, records in growth.items():
        if len(records)<2:
            velocity=0
        else:
            velocity = (records[-1]["hours"] - records[0]["hours"]) / len(records)
        predicted_hours = round(records[-1]["hours"] + velocity*weeks*(market.get(skill,1)/5),1)
        predictions.append({
            "skill": skill,
            "predicted_hours": predicted_hours,
            "reasoning": f"{skill} allocation changed {velocity:.2f} hours/week. Market demand={market.get(skill,1)}."
        })
    return predictions

@app.route("/growth_prediction", methods=["POST"])
def growth_prediction():
    user_id = request.json["user_id"]
    return jsonify({"growth": get_growth(user_id), "predictions": predict_future(user_id)})

if __name__=="__main__":
    app.run(debug=True)