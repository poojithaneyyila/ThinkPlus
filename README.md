# Personalized Learning Progress & Recommendation System

## Problem Statement

Develop a **personalized learning platform** that tracks student performance, provides adaptive learning recommendations, and allows students to attempt quizzes.  
The system should:

- Track quiz attempts and scores.
- Display a **personalized dashboard** showing progress.
- Provide **topic and difficulty recommendations** based on performance.
- Be responsive and visually polished.

**Objective:** Implement a full-stack platform with frontend (React) and backend (Flask) that provides adaptive learning recommendations.  

---

## Features

### Frontend (React)

- User login and logout.
- Attempt quizzes by selecting a topic and entering score.
- View **dashboard**:
  - Average score
  - Current level
  - Total attempts
- Get **recommendations**:
  - Suggested topic (same as attempted topic)
  - Difficulty adjustment (Increase / Decrease / Same)
- Responsive and mobile-friendly design.
- Clean and modern styling with light/dark theme.

### Backend (Flask)

- User authentication (login).
- Store quiz attempts in-memory.
- Calculate progress metrics.
- Generate recommendations based on last quiz score.
- Expose APIs for frontend consumption.

### Recommendation Logic

| Score       | Difficulty Adjustment |
|------------|----------------------|
| < 50       | Decrease             |
| 50–79      | Same                 |
| ≥ 80       | Increase             |

- Topic recommendation **always matches the last attempted topic**.

## Folder Structure

learning-system/ ├─ frontend/        # React frontend │   ├─ src/ │   │   ├─ App.jsx │   │   ├─ main.jsx │   │   └─ style.css │   ├─ package.json │   └─ ... ├─ backend/         # Flask backend │   ├─ app.py │   ├─ requirements.txt │   └─ ... └─ README.md

