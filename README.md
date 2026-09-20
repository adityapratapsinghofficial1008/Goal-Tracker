# Goal Tracker

A modern web application to track goals, subgoals, activities, and progress. Built with React (Vite) on the frontend and Node.js / Express on the backend.

## 🚀 Project Structure

```text
Goal-Tracker/
├── client/          # Frontend React application (Vite)
└── server/          # Backend Node.js / Express server
```

## 🛠️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+ recommended)
- npm or yarn

### 1. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory based on `.env.example`:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
```

Start the backend server:

```bash
npm start
```

### 2. Frontend Setup

```bash
cd client
npm install
npm run dev
```

Open your browser at `http://localhost:5173` (or the port indicated by Vite).

## 📄 License

MIT
