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

Client -> API (Express) -> MongoDB -> Worker (Agenda) -> Email Service

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

## 🧪 Testing
This project uses **Jest** for unit testing.
### Run tests
```bash
npm run test
```

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
  "name": "The User",
  "email": "usertest@example.com",
  "birthday": "1999-04-17",
  "timezone": "Asia/Jakarta"
}
```
#### Response
```json
{
    "id": "69e199f0c624262b01bbf291",
    "name": "The User",
    "email": "usertest@example.com",
    "birthday": "1999-04-17T00:00:00.000Z",
    "timezone": "Asia/Jakarta",
    "created_at": "2026-04-17T02:24:48.996Z"
}
```
#### 🛡️ Validation Rules
- name → required string
- email → required valid email
- birthday → required ISO date format
- timezone → required valid IANA timezone

### 🔍 Get User by ID
Get a specific user using their unique ID.
```http
GET /users/:user_id
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
    "id": "69e199f0c624262b01bbf291",
    "name": "The User",
    "email": "usertest@example.com",
    "birthday": "1999-04-17T00:00:00.000Z",
    "timezone": "Asia/Jakarta"
}
```
### ✏️ Update User
Update user information (partial update supported).
```http
PATCH /users/:user_id
```
#### Params
```markdown
**user_id**
- Type: string  
- Required: Yes  
- Description: MongoDB ObjectId
```
#### Request Body
```json
{
  "name": "User Update",
  "birthday": "2005-04-16",
  "timezone": "America/Sao_Paulo"
}
```
#### Response
```json
{
    "id": "69e199f0c624262b01bbf291",
    "name": "User Update",
    "email": "usertest@example.com",
    "birthday": "2005-04-16T00:00:00.000Z",
    "timezone": "America/Sao_Paulo"
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
    "message": "User deleted successfully",
    "id": "69e199f0c624262b01bbf291"
}
```

## 📮 API Testing (Postman)

A Postman collection is included for easy API testing and local development.

---

### 📁 Files

- Collection: `/postman/Birthday-Reminder.postman_collection.json`
- Environment: `/postman/Birthday-Reminder-Env.json`

---

### 🚀 How to Use

1. Open **Postman**
2. Click **Import**
3. Select both files from the `/postman` folder
4. Ensure `base_url` is set correctly (default: `http://localhost:3000`)

---

### ⚙️ Environment Variables

| Key       | Example Value           |
|---------- |-------------------------|
| base_url  |  http://localhost:3000  |

---

### 📌 Recommended Flow

1. Create User
2. Get User by ID
3. Update User
4. Delete User

---

### 💡 Notes

- All requests use `{{base_url}}` for flexibility across environments
- Use the returned `user_id` from Create User for other requests
- Ensure backend server is running before testing:
```bash
docker compose up --build