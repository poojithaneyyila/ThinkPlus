from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app)

# -----------------------------
# Users
# -----------------------------
users = {
    1: {"name": "pooji", "password": "pooji123"},
    2: {"name": "mouni", "password": "mouni123"},
    3: {"name": "nani", "password": "nani123"}
}

# Topics
topics = {
    1: "Python Basics",
    2: "JavaScript",
    3: "HTML/CSS",
    4: "ReactJS",
    5: "Flask"
}

# Quiz attempts
quiz_data = {}

# -----------------------------
# Login
# -----------------------------
@app.route("/login", methods=["POST"])
def login():
    data = request.json
    username = data.get("username")
    password = data.get("password")
    for uid, user in users.items():
        if user["name"].lower() == username.lower() and user["password"] == password:
            return jsonify({"user_id": uid})
    return jsonify({"error": "Invalid credentials"}), 401

# -----------------------------
# Submit quiz
# -----------------------------
@app.route("/submit-quiz", methods=["POST"])
def submit_quiz():
    data = request.json
    user_id = data.get("user_id")
    topic_id = data.get("topic_id")
    score = data.get("score")

    if not all([user_id, topic_id, score is not None]):
        return jsonify({"error": "Missing data"}), 400

    quiz_data.setdefault(user_id, []).append({
        "topic_id": topic_id,
        "score": score,
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    })
    return jsonify({"message": "Quiz submitted successfully!"})

# -----------------------------
# Dashboard
# -----------------------------
@app.route("/dashboard/<int:user_id>", methods=["GET"])
def dashboard(user_id):
    attempts = quiz_data.get(user_id, [])
    if not attempts:
        return jsonify({
            "average_score": 0,
            "current_level": "Beginner",
            "total_attempts": 0
        })
    avg_score = sum(a["score"] for a in attempts) / len(attempts)
    if avg_score >= 80:
        level = "Advanced"
    elif avg_score >= 50:
        level = "Intermediate"
    else:
        level = "Beginner"
    return jsonify({
        "average_score": round(avg_score, 1),
        "current_level": level,
        "total_attempts": len(attempts)
    })

# -----------------------------
# Recommendation (same topic, adjust difficulty only)
# -----------------------------
@app.route("/recommend/<int:user_id>", methods=["GET"])
def recommend(user_id):
    topic_id = int(request.args.get("topic", 1))  # default topic = 1
    attempts = quiz_data.get(user_id, [])

    # If no attempts, recommend the selected topic with "Same" difficulty
    if not attempts:
        return jsonify({
            "recommended_topic": topics[topic_id],
            "difficulty_adjustment": "Same"
        })

    # Use the last submitted score to decide difficulty
    last_score = attempts[-1]["score"]

    if last_score < 50:
        difficulty = "Decrease"
    elif last_score >= 80:
        difficulty = "Increase"
    else:
        difficulty = "Same"

    return jsonify({
        "recommended_topic": topics[topic_id],  # always same topic
        "difficulty_adjustment": difficulty
    })

# -----------------------------
# Run app
# -----------------------------
if __name__ == "__main__":
    app.run(debug=True)
