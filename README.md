# Student Feedback Form

A comprehensive feedback management system where **admins** can create, manage, and analyze feedback forms, while **students/users** can securely submit feedback via shared links. Built with modern technologies for performance, security, and ease of use.

---

## 📄 Table of Contents

- [Problem Statement](#problem-statement)  
- [Features](#features)  
- [How It Works / Flow](#how-it-works--flow)  
- [Tech Stack & Hosting](#tech-stack--hosting)  
- [Live Demo](#live-demo)  
- [Installation & Setup](#installation--setup)  
- [Usage](#usage)  
- [Credits](#credits)

---

## 🧮 Problem Statement

In many educational settings, gathering feedback from students in a structured, secure, and insightful manner can be challenging. Existing systems often lack flexibility in form creation, inadequate analytics, poor security, or are not responsive.  

The *Student Feedback Form* project aims to address this by giving **admins** full control over creating and managing feedback forms, analyzing responses, and securely interacting with students; while keeping the submission process simple and secure for users.

---

## ✨ Features

### Admin Capabilities

- **User Authentication**  
  Secure login and signup with full protection (JWT or similar).  

- **Form Creation & Management**  
  Create custom feedback forms. Edit or delete existing forms. Generate a **sharable link** for each form.

- **Analytics Dashboard**  
  View total number of forms created, response counts per form, and other summary statistics.

- **Chat Functionality**  
  Communicate within the platform via built‐in chat.

- **File Sharing & Export**  
  Share Excel sheets or download responses in an advanced format for further analysis.

- **Role‐Based Access Control**  
  Admins have full access; ordinary users have limited privileges (only to submit feedback).

### User / Student Functionality

- Access forms via sharable links (no need for full account privileges to submit feedback).  
- Secure and simple submission process.  
- Responsive design to work on mobile / desktop.

---

## 🛠️ How It Works / Flow

1. **Signup / Login**  
   Admin registers or logs in securely.  

2. **Form Creation**  
   Admins create a feedback form: define questions, settings, etc. A shareable link is generated.

3. **Distribution**  
   Admin shares the link with students/users.

4. **Feedback Submission by Users**  
   Users open link, fill form, submit feedback safely.

5. **Analytics & Management by Admins**  
   Admin views number of responses, form metrics; can share responses via Excel, chat, manage forms (edit/delete), etc.

---

## ⚙ Tech Stack & Hosting

| Component | Tech / Tools |
|-----------|---------------|
| Frontend | React.js + JavaScript |
| Styling | Tailwind CSS |
| Backend | Node.js + Express.js |
| Database | MongoDB |
| Authentication / Security | (e.g., JWT, secure password hashing, etc.) |
| Hosting / Deployment | Vercel (frontend), Render (backend) |

---

## 🔗 Live Demo

Check out the live version here:  
[Live Demo URL]  
*(Replace with your actual deployed link)*

---

## 📥 Installation & Setup

To get this running locally:

1. **Clone the repository**

   ```bash
   git clone https://github.com/adarshaldkar/Student_Feedback_form.git
   cd Student_Feedback_form
2.Install dependencies
# In frontend folder
cd frontend
npm install

# In backend folder
cd ../backend
npm install

3.Environment variables

In backend, create a .env file with values for:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
# any other required variables

4.Running locally
# Start backend
cd backend
npm start

# Start frontend
cd ../frontend
npm run dev


5.Access

Frontend usually on http://localhost:3000 or Vite's default port (check console)

Backend on http://localhost:5000 (or whatever port you configured)

🧭 Usage

Admins log in → create form → get shareable link → share with students

Students follow link → submit feedback

Admins monitor responses, use analytics, export data, chat/share files as needed

🙌 Credits

Developed by:

Adarsh Patel
Praveen Kumar

⭐ If this project helps you or inspires you, please consider starring the repo!

