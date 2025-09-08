import { useState } from "react"
import api from "../api"
import { ACCESS_TOKEN,REFRESH_TOKEN } from "../constant"
import { useNavigate } from "react-router-dom"
import "../styles/Form.css";

function Form({method, route}){
    const [username,setUsername] = useState("")
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const navigate = useNavigate();

    const loginOrRegister = method === 'login' ? 'LOGIN' : 'REGISTER';

    const handleSubmit = async (e) => {
        e.preventDefault();

        const isLogin = method === 'login';

        const data = isLogin ? {username,password} : {username,email,password}
        try{
            const res = await api.post(route, data)
            if (isLogin){
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                navigate("/")
            }
            else{
                navigate("/login")
            }
        }
        catch(err){
            alert(err)
        }
        finally{
            setUsername("");
            setEmail("");
            setPassword("");
        }
    }

    return(
        <>
        <form onSubmit={handleSubmit}>
            <div className="login-container">
                <h1>{loginOrRegister}</h1>
                
                <div className="input-group">
                    <label htmlFor="email">USERNAME</label>
                    <input 
                        type="username" 
                        id="username" 
                        placeholder="username" 
                        value={username}
                        onChange={(e) => {setUsername(e.target.value)}}
                    />
                </div>

                {method === 'register' && (
                    <div className="input-group">
                        <label htmlFor="email">EMAIL</label>
                        <input 
                            type="email" 
                            id="email" 
                            placeholder="your@email.com" 
                            value={email}
                            onChange={(e) => {setEmail(e.target.value)}}
                        />
                    </div>
                )}
                
                <div className="input-group">
                    <label htmlFor="password">PASSWORD</label>
                    <input type="password" id="password" placeholder="••••••••" 
                    value={password}
                    onChange={(e) => {setPassword(e.target.value)}}
                    />
                </div>
                
                <button type="submit">SIGN IN</button>
                
                <div className="divider">OR</div>
                
                {loginOrRegister === "LOGIN" && (
                    <div className="footer">
                        Don't have an account? <a href="/register">Sign up</a>
                    </div>
                )}

                {loginOrRegister === "REGISTER" && (
                    <div className="footer">
                        Already have an account? <a href="/login">Sign in</a>
                    </div>
                )}
                
            </div>
        </form>
    </>
    )
}

export default Form