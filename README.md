# Project Management & Evaluation System (PMES)

A **database-driven full-stack web application** designed to streamline academic project management, milestone tracking, submissions, and evaluation between students and faculty guides.

The system digitizes the traditional project evaluation workflow by integrating **role-based dashboards, milestone monitoring, submission tracking, and structured evaluation mechanisms**.

---

# Overview

Engineering project work typically involves multiple stakeholders including **students, faculty guides, and administrators**. Managing this workflow manually often leads to:

* Poor progress visibility
* Missed submission deadlines
* Inefficient communication
* Lack of structured evaluation

The **Project Management & Evaluation System (PMES)** addresses these challenges by providing a centralized digital platform that manages the entire project lifecycle — from team creation to milestone evaluation.

---

# Key Features

## Role-Based Access System

### Admin

* Create and manage student teams
* Assign guides to teams
* Define project milestones
* Manage student and guide accounts
* Generate performance reports

### Guide

* View assigned project teams
* Monitor team progress
* Evaluate milestone submissions
* Provide structured feedback and scores

### Student

* View assigned milestones
* Upload project submissions
* Track project progress
* View evaluation feedback

---

# Tech Stack

| Layer           | Technology                |
| --------------- | ------------------------- |
| Frontend        | React + TypeScript        |
| Build Tool      | Vite                      |
| Styling         | Tailwind CSS              |
| Backend         | Node.js + Express         |
| Database        | MySQL                     |
| Authentication  | Role-Based Access Control |
| Version Control | Git & GitHub              |

---

# System Architecture

Frontend (React + TypeScript)

│
├── UI Components
├── Role-based Dashboards
├── Authentication
└── Submission Interface

Backend (Node.js + Express)

│
├── API Routes
├── Middleware
├── Authentication Logic
└── Database Integration

Database (MySQL)

│
├── Users
├── Teams
├── Team Members
├── Milestones
├── Submissions
├── Evaluations
└── Notifications

---

# Database Design

The system uses a **relational database schema normalized up to Third Normal Form (3NF)** to ensure data integrity and eliminate redundancy.

## Main Tables

### Users

Stores authentication credentials and user roles.

Fields include:

* user_id
* full_name
* email
* password_hash
* role
* created_at

### Teams

Represents project teams and assigned guides.

Fields include:

* team_id
* project_title
* guide_id
* status
* created_at

### Team Members

Maps students to teams.

Fields include:

* team_member_id
* team_id
* user_id
* joined_at

### Milestones

Stores project milestones and deadlines.

Fields include:

* milestone_id
* team_id
* title
* description
* due_date
* extended_deadline

### Submissions

Stores milestone submissions with version control.

Fields include:

* submission_id
* milestone_id
* submitted_by
* file_path
* version
* submitted_at

### Evaluations

Stores guide evaluation results.

Fields include:

* evaluation_id
* submission_id
* evaluated_by
* score
* feedback
* rubric_json

### Notifications

Stores reminders and alerts.

Fields include:

* notification_id
* user_id
* message
* type
* created_at

---

# ER Model Entities

The system includes the following entities:

* Student
* Faculty Guide
* Team
* Project
* Milestone
* Evaluation

### Relationships

* A **student belongs to one team**
* A **team is supervised by one guide**
* A **team works on one project**
* A **project contains multiple milestones**
* A **guide evaluates milestone submissions**

---

# System Workflow

1. Admin creates teams and assigns guides.
2. Admin defines project milestones for teams.
3. Students upload submissions for milestones.
4. Guides evaluate submissions using structured scoring.
5. Feedback and evaluation scores are stored in the database.
6. Admin generates reports and monitors progress.

---

# Project Structure

DBMS
│
├── backend
│   ├── src
│   │   ├── routes
│   │   ├── middlewares
│   │   ├── lib
│   │   ├── db.js
│   │   └── index.js
│   └── server.js
│
├── src
│   ├── components
│   ├── contexts
│   ├── hooks
│   ├── pages
│   │   ├── admin
│   │   ├── guide
│   │   └── student
│   ├── App.tsx
│   └── main.tsx
│
├── public
├── assets
└── README.md

---

# Core Modules

## Authentication Module

Handles login and redirects users to their respective dashboards based on role.

## Admin Module

Responsible for managing users, teams, projects, and milestones.

## Guide Module

Allows guides to monitor team progress and evaluate milestone submissions.

## Student Module

Provides access to milestones, submission uploads, and evaluation feedback.

## Notification Module

Generates alerts for deadlines, submissions, and evaluations.

---

# Installation & Setup

## 1 Clone the Repository

git clone https://github.com/Chirag-Rk/DBMS.git

---

## 2 Navigate to Project Directory

cd DBMS

---

## 3 Install Dependencies

npm install

---

## 4 Configure Environment Variables

Create a `.env` file in the backend folder:

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=project_management

---

## 5 Start Backend Server

node server.js

---

## 6 Run Frontend

npm run dev

---

# Example Functionalities

* Team creation and guide assignment
* Milestone management
* File submission with version tracking
* Guide evaluation system
* Student progress tracking
* Admin reporting dashboard

---

# Future Improvements

Possible future enhancements include:

* Real-time chat between guides and students
* AI-based milestone deadline prediction
* Advanced analytics dashboards
* Mobile application support
* Automated plagiarism detection

---

# Contributors

Chirag R K
Manasvi B M
Sthuthi M Poojary
Vaishnavi Prabhu

Sahyadri College of Engineering and Management
Department of CSE (AI & ML)

---
# Deployment
https://dbms-gwhr4dqji-chiragravi1002-1999s-projects.vercel.app/
# License

This project was developed for academic purposes as part of the **Database Management Systems Mini Project**.
