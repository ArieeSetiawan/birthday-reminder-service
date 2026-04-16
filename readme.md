# 🎂 Birthday Reminder Service

A Node.js-based birthday reminder system using **Express**, **Agenda**, **MongoDB**, **Nodemailer** and **Docker**.  
It automatically sends birthday emails and schedules the next reminder.

---

## 📌 Overview

This service runs a background worker that:

- Stores user birthdays in MongoDB
- Schedules recurring yearly jobs using Agenda
- Detects when today matches a user's birthday
- Sends automated email greetings
- Reschedules the next execution automatically

---

## 🧱 Architecture

APP (API) -> MongoDB -> Worker (Agenda) -> Email

---

## ⚙️ Tech Stack

- Node.js (Backend runtime)
- Express.js (API layer)
- MongoDB (Database)
- Agenda.js (Job scheduling)
- Nodemailer (Email service)
- Docker (Containerization)

---

## 🚀 Features

- ⏰ Distributed job scheduling using Agenda
- 📧 Automated email notifications
- 🌍 Timezone-aware birthday calculation
- 🔁 Auto rescheduling for next year
- 🐳 Fully containerized setup (App + Worker + DB)
- ⚡ Dev-ready with nodemon hot reload

---

## 🛠️ Installation
```bash
git clone https://github.com/ArieeSetiawan/birthday-reminder-service.git
```
## 🔌 Set Environment Variables

Create a `.env` file in the project root based on `.env.example`:

## 🐳 Run with Docker
### 1. Build containers and start services
```bash
docker compose up --build -d
```
### 2. View logs (Optional)
```bash
docker compose logs -f
```
### 3. Stop Services
```bash
docker compose down
```

## API Documentation
## 👤 Users API

### ➕ Create User

Create a new user and automatically schedule their birthday reminder.

```http
POST /users
```
#### Request Body
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "birthday": "1995-06-15",
  "timezone": "Asia/Jakarta"
}
```
#### Response
```json
{
  "id": "64f1c2a9b3c1a2d4e5f6a7b8",
  "name": "John Doe",
  "email": "john@example.com",
  "birthday": "1995-06-15",
  "timezone": "Asia/Jakarta"
}
```
#### 🛡️ Validation Rules
- name → required string
- email → required valid email
- birthday → required ISO date format
- timezone → required valid IANA timezone

### 🔍 Get User by ID
```markdown
**user_id**
- Type: string  
- Required: Yes  
- Description: MongoDB ObjectId
```
#### Params
**user_id**
- Type: string  
- Required: Yes  
- Description: MongoDB ObjectId
### ✏️ Update User
Update user information (partial update supported).
```http
PATCH /users/:user_id
```
#### Request Body
```json
{
  "name": "John Updated",
  "timezone": "Asia/Singapore"
}
```
#### Response
```json
{
  "id": "64f1c2a9b3c1a2d4e5f6a7b8",
  "name": "John Updated",
  "email": "john@example.com",
  "birthday": "1995-06-15",
  "timezone": "Asia/Singapore"
}
```
### 🗑️ Delete User
Delete a user and remove their scheduled jobs.
```http
DELETE /users/:user_id
```
#### Params
```markdown
**user_id**
- Type: string  
- Required: Yes  
- Description: MongoDB ObjectId
```
#### Response
```json
{
  "id": "64f1c2a9b3c1a2d4e5f6a7b8",
  "message": "User deleted successfully"
}
```