# ChatHub – Real-Time Chat Application

ChatHub is a real-time chat application built with **Django + Django Channels** on the backend and **React (Vite)** on the frontend. It features secure JWT authentication, WebSocket-powered messaging, profile management with image uploads, and online/offline/typing indicators.

![image alt](https://github.com/benet013/Chat-App/blob/be7e0d503459a4d19249fe00e219f286f6aa2a56/Screenshot%202025-10-14%20184741.png)

---

## Features

- Real-time one-to-one chat using **Django Channels** and **WebSockets**
- **JWT authentication** with access and refresh tokens
- **REST API** built with Django REST Framework
- Live **online/offline** status and typing indicators
- User **profile management** with avatar upload
- Responsive React frontend with protected routes
- Redis-powered channel layer for WebSocket communication

---

## Project Structure

bash 
```
chat-hub/
├── backend/
│   ├── root/
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── asgi.py
│   │   └── ...
│   ├── user/
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── serializers.py
│   │   ├── middleware.py
│   │   └── consumers.py
│   └── manage.py
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   └── App.jsx
    ├── public/
    ├── package.json
    └── vite.config.js

```

## Backend Setup (Django)

1. Clone the repository

```
git clone https://github.com/benet013/Chat-App
cd chat-hub/backend
```

2. Create a virtual environment and install dependencies
```
python -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

3. Set up environment variables
Create a .env file in backend/:
```
SECRET_KEY=your_django_secret_key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
REDIS_URL=redis://127.0.0.1:6379
```

4. Run database migrations
```
python manage.py makemigrations
python manage.py migrate
```

5. Create a superuser (optional)
```
python manage.py createsuperuser
```
6. Start Redis
You must have Redis running for WebSocket channels:
bash
```
redis-server
```
7. Start the Django server
```
python manage.py runserver
```

The backend runs at: http://127.0.0.1:8000

## Frontend Setup (React + Vite)
1. Navigate to the frontend
```
cd ../frontend
```

2. Install dependencies
```
npm install
```

3. Set up environment variables
Create a .env file in frontend/:
```
VITE_API_BASE=http://127.0.0.1:8000
VITE_WS_BASE=ws://127.0.0.1:8000
```

4. Run the development server
```
npm run dev

```
The frontend runs at: http://localhost:5173

## Running the Full Application

Start Redis (required for channels):

bash
```
redis-server
```

Run the backend:

bash
```
cd backend
python manage.py runserver
```

Run the frontend:
bash
```
cd frontend
npm run dev
```

Then open: http://localhost:5173

## Tech Stack

### Backend:

- Django 5.x

- Django REST Framework

- Django Channels

- Redis

- Pillow
---
### Frontend:

- React (Vite)

- React Router

- Material UI

- JWT Decode

- Axios
