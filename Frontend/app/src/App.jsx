import ProtectedRoute from "./components/ProtectedRoute";
import {BrowserRouter,Routes, Route } from 'react-router-dom';
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

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
            path="/user/:id"
            element={
              <ProtectedRoute>
                <Home />
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
