import { useState } from "react";
import axios from "axios";
import "./style.css";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userId, setUserId] = useState(null);
  const [score, setScore] = useState("");
  const [dashboard, setDashboard] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [topicId, setTopicId] = useState(1);

  const topics = [
    {id:1,name:"Python Basics"}, {id:2,name:"JavaScript"},
    {id:3,name:"HTML/CSS"}, {id:4,name:"ReactJS"}, {id:5,name:"Flask"}
  ];

  const login = async () => {
    try {
      const res = await axios.post("http://127.0.0.1:5000/login", {username, password});
      setUserId(res.data.user_id);
      alert("Login Successful");
    } catch {
      alert("Invalid Credentials");
    }
  };

  const logout = () => {
    setUserId(null);
    setDashboard(null);
    setRecommendation(null);
    setScore("");
  };

  const submitQuiz = async () => {
    if(score==="") return alert("Enter score");
    await axios.post("http://127.0.0.1:5000/submit-quiz", {
      user_id: userId,
      topic_id: topicId,
      score: Number(score)
    });
    alert("Quiz Submitted!");
    setScore("");
    loadDashboard();
    loadRecommendation();
  };

  const loadDashboard = async () => {
    const res = await axios.get(`http://127.0.0.1:5000/dashboard/${userId}`);
    setDashboard(res.data);
  };

  const loadRecommendation = async () => {
    const res = await axios.get(`http://127.0.0.1:5000/recommend/${userId}?topic=${topicId}`);
    setRecommendation(res.data);
  };

  return (
    <div className="dashboard-box">
      {!userId ? (
        <div className="login-box">
          <h2>Login</h2>
          <input placeholder="Username" value={username} onChange={(e)=>setUsername(e.target.value)}/>
          <input type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
          <button onClick={login}>Login</button>
        </div>
      ) : (
        <div>
          <button onClick={logout}>Logout</button>
          <h1>Personalized Learning Dashboard</h1>

          <div className="quiz-box">
            <h3>Submit Quiz</h3>
            <select value={topicId} onChange={(e)=>setTopicId(Number(e.target.value))}>
              {topics.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
            <input type="number" placeholder="Enter Score" value={score} onChange={(e)=>setScore(e.target.value)}/>
            <button onClick={submitQuiz}>Submit</button>
          </div>

          <hr/>

          <button onClick={loadDashboard}>Load Dashboard</button>
          {dashboard && (
            <div className="stats-box">
              <p>Average Score: {dashboard.average_score}</p>
              <p>Current Level: {dashboard.current_level}</p>
              <p>Total Attempts: {dashboard.total_attempts}</p>
            </div>
          )}

          <hr/>

          <button onClick={loadRecommendation}>Get Recommendation</button>
          {recommendation && (
            <div className="recommend-box">
              <p>Recommended Topic: {recommendation.recommended_topic}</p>
              <p>Difficulty Adjustment: {recommendation.difficulty_adjustment}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;