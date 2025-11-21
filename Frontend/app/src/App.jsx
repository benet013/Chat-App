import ProtectedRoute from "./components/ProtectedRoute";
import {BrowserRouter,Routes, Route } from 'react-router-dom';
import { useEffect } from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/profile";

function RegisterAndLogout(){
  useEffect(() => {
    try {
      localStorage.clear();
    } catch (e) {
      console.warn("localStorage unavailable:", e);
    }
  }, []);
  return <Register />
}

function Logout(){
  useEffect(() => {
    try {
      localStorage.clear();
    } catch (e) {
      console.warn("localStorage unavailable:", e);
    }
  }, []);
  return <Login />
}

function App() {
  
  return (
    <>
       <BrowserRouter>
        <Routes>
          <Route 
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route 
            path="chat/user/:id"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route path="/login" element={<Login />}/>
          <Route path="/logout" element={<Logout />}/>
          <Route path="/register" element={<RegisterAndLogout />}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
