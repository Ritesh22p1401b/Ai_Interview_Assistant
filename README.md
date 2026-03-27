# Resume-Based AI Interview System

An AI-powered interview platform that generates personalized interview questions from a candidate’s resume and evaluates responses with intelligent feedback.

---

## 📸 Project Preview

<p align="center">
  <img src="assets/pic2.png" alt="Dashboard" width="800"/>
</p>

<p align="center">
  <img src="assets/pic1.png" alt="Interview Interface" width="800"/>
</p>

---

## Overview

This system automates the interview process by analyzing resumes and conducting AI-driven interviews. It helps candidates practice and enables scalable evaluation without manual intervention.

---

## Features

- Resume parsing to extract skills, experience, and projects  
- AI-based question generation tailored to the candidate profile  
- Answer evaluation based on relevance, accuracy, and clarity  
- Detailed feedback with improvement suggestions  
- Performance analytics dashboard

---
## 🏗️ System Architecture

```mermaid
flowchart LR

%% USER
U1[User]

%% FRONTEND
subgraph Frontend
F1[UI Components]
F2[Interview Interface]
F3[Dashboard]
F4[API Client]
end

%% BACKEND
subgraph Backend
B1[API Gateway]
B2[Auth Service]
B3[Resume Parser]
B4[Interview Engine]
B5[Evaluation Engine]
end

%% AI
subgraph AI
AI1[Question Generation]
AI2[Answer Evaluation]
end

%% DATABASE
subgraph Database
DB1[(Users)]
DB2[(Resumes)]
DB3[(Interviews)]
DB4[(Responses)]
DB5[(Analytics)]
end

%% FLOW
U1 --> F1
F1 --> F2
F2 --> F4
F3 --> F4

F4 --> B1

B1 --> B2
B1 --> B3
B1 --> B4
B1 --> B5

B3 --> B4
B4 --> AI1
B5 --> AI2

AI1 --> B4
AI2 --> B5

B2 --> DB1
B3 --> DB2
B4 --> DB3
B5 --> DB4
B5 --> DB5

DB5 --> F3
```
---
## Workflow

1. Upload resume  
2. Extract key information (skills, projects, experience)  
3. Generate interview questions using AI  
4. Candidate submits answers  
5. AI evaluates responses  
6. Display scores and feedback  

---
## Tech Stack

**Frontend**
- React.js  
- Three.js  
- Tailwind CSS  

**Backend**
- Node.js  
- Express.js  

**AI Integration**
- Google Gemini API  

**Database**
- MongoDB  

---

## Output Metrics

- Question-wise score  
- Overall interview score  
- Skill-based performance analysis  
- AI-generated feedback and suggestions  

---

## Use Cases

- Student placement preparation  
- Mock interview practice  
- Recruitment pre-screening  
- Skill assessment  

---

## Future Improvements

- Voice-based interview support  
- Multi-language capability  
- Advanced analytics dashboard  
- Real-time interaction enhancements  

---
