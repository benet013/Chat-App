import ProtectedRoute from "./components/ProtectedRoute";
import {BrowserRouter,Routes, Route } from 'react-router-dom';
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/profile";

function RegisterAndLogout(){
  localStorage.clear()
  return <Register />
}

function Logout(){
  localStorage.clear()
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
