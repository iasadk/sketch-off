# 🎨 Sketch-Off

**Sketch-Off** is a real-time multiplayer drawing and guessing game inspired by games like Scribble.io.

Players can create or join rooms, draw on a shared canvas, and interact with other players in real time. The project focuses on building a complete real-time web application using **Next.js, TypeScript, FastAPI, WebSockets, and MongoDB**.

> 🚧 **Status:** In Development

---

## ✨ Features

### 🎨 Drawing Canvas

* Freehand drawing using HTML Canvas
* Multiple colors
* Adjustable stroke width
* Eraser tool
* Clear canvas
* Stroke history
* Drawing replay functionality

### 🏠 Room System

* Create multiplayer rooms
* Generate unique room codes
* Join existing rooms using a room code
* Configurable maximum players
* Track players inside a room

### ⚡ Real-Time Communication

* WebSocket-based communication
* Real-time player updates
* Real-time drawing synchronization
* Room-based communication
* Designed for low-latency multiplayer interactions

### 👥 Multiplayer

* Multiple players can participate in the same room
* Player list updates in real time
* Shared game state between connected clients

### 🛡️ Backend

* REST APIs for room management
* FastAPI backend
* Pydantic request validation
* MongoDB for persistent data
* Structured service and router architecture
* Centralized exception handling

---

## 🏗️ Tech Stack

### Frontend

* **Next.js**
* **React**
* **TypeScript**
* **Tailwind CSS**
* **HTML Canvas**
* **Axios**

### Backend

* **Python**
* **FastAPI**
* **WebSockets**
* **Pydantic**
* **Uvicorn**

### Database

* **MongoDB**

### Architecture

```text
┌──────────────────────┐
│      Next.js         │
│   React + TypeScript │
└──────────┬───────────┘
           │
           │ REST API
           ▼
┌──────────────────────┐
│       FastAPI        │
│      REST APIs       │
└──────────┬───────────┘
           │
           │ MongoDB
           ▼
┌──────────────────────┐
│       MongoDB        │
└──────────────────────┘

           ▲
           │
       WebSocket
           │
           ▼
┌──────────────────────┐
│   Real-Time Server   │
│       FastAPI        │
└──────────────────────┘
```

---

## 📁 Project Structure

```text
sketch-off/
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   └── ...
│
├── backend/
│   ├── rooms/
│   │   ├── router.py
│   │   ├── schema.py
│   │   └── service.py
│   │
│   ├── websocket/
│   ├── database/
│   ├── main.py
│   └── ...
│
├── .gitignore
└── README.md
```

> The exact structure may evolve as the project grows.

---

## 🔄 How It Works

### 1. Create a Room

A player creates a room by providing:

* Room name
* Maximum number of players

The backend generates a unique room code and stores the room information in MongoDB.

```text
Client
  │
  │ POST /room/create
  ▼
FastAPI
  │
  ├── Validate request
  ├── Generate room code
  └── Save room
        │
        ▼
     MongoDB
```

---

### 2. Join a Room

Players use the generated room code to join an existing room.

Once connected, the player establishes a WebSocket connection with the server.

```text
Player
   │
   │ Join Room
   ▼
Room Code
   │
   ▼
WebSocket Connection
   │
   ▼
Game Room
```

---

### 3. Real-Time Drawing

When a player draws on the canvas, the drawing data can be sent through the WebSocket connection.

The server broadcasts the drawing event to other players connected to the same room.

```text
Player A
   │
   │ Drawing Event
   ▼
WebSocket Server
   │
   ├──────────────► Player B
   │
   └──────────────► Player C
```

This allows every player to see the shared drawing in real time.

---

## 🎨 Canvas Implementation

The drawing system is based on the browser's **HTML Canvas API**.

The canvas currently supports:

```text
Drawing
   ↓
Color Selection
   ↓
Stroke Width
   ↓
Eraser
   ↓
Clear Canvas
   ↓
Stroke History
   ↓
Replay
```

Instead of treating the canvas as only a bitmap, drawing actions are tracked as strokes.

A stroke contains information such as:

```ts
{
  points: [...],
  color: "#000000",
  width: 4,
  tool: "pen"
}
```

This makes features such as **undo/history, replay, and real-time synchronization** easier to implement.

---

## 🔌 API

### Create Room

```http
POST /room/create
```

Example request:

```json
{
  "name": "Sketch Room",
  "max_players": 4
}
```

Example response:

```json
{
  "name": "Sketch Room",
  "code": "A7K2PX",
  "max_players": 4,
  "players": []
}
```

---

## 🔌 WebSocket

The WebSocket layer is responsible for real-time game communication.

Typical events can include:

```text
player_joined
player_left
draw
clear_canvas
game_started
game_ended
```

The exact event structure may evolve as the multiplayer game logic is implemented.

---

## ⚙️ Environment Variables

Create a `.env` file for the backend:

```env
MONGODB_URI=your_mongodb_connection_string
ENVIRONMENT=local
```

For the frontend:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

> Never commit `.env` files or database credentials to the repository.

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

* Node.js
* Python 3.10+
* MongoDB
* Git

---

### Clone the Repository

```bash
git clone https://github.com/<your-username>/sketch-off.git

cd sketch-off
```

---

## 🖥️ Frontend Setup

Navigate to the frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create your environment file:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

Start the development server:

```bash
npm run dev
```

The frontend will be available at:

```text
http://localhost:3000
```

---

## 🐍 Backend Setup

Navigate to the backend:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate it on Windows:

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create your environment file:

```env
MONGODB_URI=your_mongodb_connection_string
ENVIRONMENT=local
```

Start the FastAPI server:

```bash
uvicorn main:app --reload
```

The backend will be available at:

```text
http://localhost:8000
```

---

## 🧠 Project Goals

Sketch-Off is built as a practical full-stack project to explore:

* Real-time application architecture
* WebSockets
* Multiplayer state synchronization
* HTML Canvas
* FastAPI
* Python backend development
* REST API design
* MongoDB
* TypeScript
* Next.js
* Frontend/backend communication
* Scalable application structure

The goal is not just to build a drawing application, but to understand how a **real-time multiplayer application works from the ground up**.

---

## 🛣️ Roadmap

### Completed

* [x] Canvas
* [x] Responsive canvas
* [x] Freehand drawing
* [x] Color selection
* [x] Stroke width
* [x] Clear canvas
* [x] Eraser
* [x] Stroke history
* [x] Drawing replay
* [x] Room creation API
* [x] MongoDB integration
* [x] Basic FastAPI architecture

### In Progress

* [ ] WebSocket connection
* [ ] Join room
* [ ] Real-time drawing synchronization
* [ ] Player management
* [ ] Room state synchronization

### Planned

* [ ] Game lobby
* [ ] Word selection
* [ ] Drawing rounds
* [ ] Guessing system
* [ ] Chat
* [ ] Scoring system
* [ ] Timer
* [ ] Round management
* [ ] Winner detection
* [ ] Game history
* [ ] Authentication
* [ ] Production deployment

---

## 🔮 Future Improvements

Some possible improvements for future versions:

* Redis for distributed real-time state
* Horizontal WebSocket scaling
* Authentication and user profiles
* Persistent game statistics
* Better canvas optimization
* Reconnection handling
* Rate limiting
* Room expiration
* Server-side game validation
* Production monitoring and logging

---

## 📸 Screenshots

Screenshots and a live demo will be added as the project progresses.

---

## 🤝 Contributing

Contributions, suggestions, and improvements are welcome.

If you find a bug or have an idea for improving Sketch-Off, feel free to open an issue or submit a pull request.

---

## 📄 License

This project is currently intended as a personal learning and portfolio project.

License information will be added before public distribution.

---

## 👨‍💻 Author

**Mohammad Asad Khan**

Built with ❤️ while exploring real-time multiplayer systems, Python backend development, and modern full-stack architecture.
