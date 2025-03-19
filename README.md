# ChatApp

.

🚀 FastAPI + React Chat App
This is a real-time chat application built with FastAPI for the backend and React for the frontend. It includes features like WebSockets for real-time communication, user authentication, private messaging, and database storage using PostgreSQL.


🚀 Features
✅ Backend (FastAPI)
- User registration and authentication with JWT
- Real-time communication using WebSockets
- Secure storage with PostgreSQL
- Private and group messaging
- CORS handling for frontend-backend communication
✅ Frontend (React)
- User-friendly interface with React
- Real-time chat updates
- State management using Context API or Redux
- API integration for user authentication and chat


Backend Setup
Create a virtual environment:

.\venv\Scripts\activate

Activate the virtual environment:
Linux/Mac:
    source venv/bin/activate

Windows:
    .\venv\Scripts\activate

Install dependencies:
    pip install -r requirements.txt

Start the FastAPI server:
    uvicorn main:app --host 0.0.0.0 --port 8000 --reload

Frontend Setup:
Navigate to the frontend directory:
    cd frontend
Install dependencies:
    npm install
Start the development server:
    npm start


🔥 Usage
Open the frontend in your browser:
    http://localhost:5173

Open the FastAPI documentation:
    http://localhost:8000/docs


✅ API Endpoints
Method	Endpoint	        Description
POST	/register	        Register a new user
POST	/login	            Authenticate user and get token
GET	    /active-connections	Get list of active connections
POST	/send-message	    Send a private message


users
👨‍💻 WebSocket Example
To connect to WebSocket:

const socket = new WebSocket('ws://localhost:8000/ws/1');

socket.onopen = () => {
  console.log('Connected to WebSocket');
};

socket.onmessage = (event) => {
  console.log('Message:', event.data);
};

socket.send('Hello, world!');


🐞 Troubleshooting
CORS Error:
Ensure CORS is properly configured in main.py:

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Database Error:

Make sure PostgreSQL is running and the connection URL is correct in .env.
WebSocket Connection Error:

Make sure the WebSocket endpoint is correctly configured and accessible.


🚀 Future Improvements
    ✅ Add file sharing in chat
    ✅ Add message encryption
    ✅ Add typing indicators


.

🌟 Contributing
Pull requests and suggestions are welcome!

Fork the repository
Create a new branch (git checkout -b feature-branch)
Commit changes (git commit -m 'Add new feature')
Push to branch (git push origin feature-branch)
Create a pull request


request
🙌 Acknowledgements
Thanks to the FastAPI and React communities for their amazing work!


🎯 Contact
abdulsalam – https://www.linkedin.com/in/salam-abdulsalam-5a0b08278/ – abdulsalamabayomi300@gmail.com

    
