# 🗳️ Voting App

This is a simple backend-based Voting App built using **Node.js**, **Express**, and **MongoDB**. It allows users to register as candidates and voters, and lets authenticated users vote for their preferred candidates. The app also supports viewing vote counts and candidate lists.

---

## 📦 Features

- Register new candidates
- Register voters (with validation)
- Vote once per voter
- Count and view votes per candidate
- Fetch all candidates
- Clean and organized API routes

---

## ⚙️ Tech Stack

- **Node.js**
- **Express**
- **MongoDB** with **Mongoose**
- **Postman** (for testing APIs)

---

## 📁 Project Structure

```
VOTING_APP/
├── models/
│   ├── Candidate.js
│   └── Voter.js
├── routes/
│   ├── candidateRoutes.js
│   ├── voteRoutes.js
│   └── voterRoutes.js
├── .env
├── server.js
└── README.md
```

---

## 🚀 Running the Project

1. **Clone the repo**

```bash
git clone https://github.com/Hussnain83/voting-app.git
cd voting-app
```

2. **Install dependencies**

```bash
npm install
```

3. **Create a `.env` file** in the root folder and add your MongoDB URI:

```
MONGO_URI=mongodb://localhost:27017/voting-app
PORT=5000
```

4. **Run the server**

```bash
npm start
```

---

## 📮 API Endpoints

| Method | Route                  | Description                    |
|--------|------------------------|--------------------------------|
| GET    | /candidate/candidates | List all candidates            |
| POST   | /candidate/add        | Add a new candidate            |
| POST   | /voter/register       | Register a new voter           |
| POST   | /vote                 | Submit a vote (once per voter) |
| GET    | /vote/count           | Get total votes per candidate  |

---

## 📬 Postman Collection

You can import a Postman collection to test each endpoint. (You can create one and add the link here.)

---

## 🧑‍💻 Author

Built by [Hussnain Dogar](https://github.com/Hussnain83)

---

## 📜 License

This project is open-source and free to use.
