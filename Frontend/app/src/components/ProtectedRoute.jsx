import {  useState, useEffect } from "react";
import api from "../api";
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { ACCESS_TOKEN,REFRESH_TOKEN } from "../constant";

function ProtectedRoute({children}){
    const [authorized, setAuthorized] = useState(null)

    useEffect(()=>{
        auth().catch(() => setAuthorized(false));
    },[])

    const refreshToken = async () => {
        const refresh = localStorage.getItem(REFRESH_TOKEN);
        try{
            const res = await api.post("/api/token/refresh/", {
                refresh : refresh
            })
            if (res.status === 200){
                localStorage.setItem(ACCESS_TOKEN, res.data.refresh);
                setAuthorized(true)
            }else{
                setAuthorized(false)
            }
        }catch(err){
            console.log(err)
            setAuthorized(false)
        }
    }

    const auth = async () => {
        const accessToken = localStorage.getItem(ACCESS_TOKEN);
        if (!accessToken){
            setAuthorized(false);
            return
        }
        const decoded = jwtDecode(accessToken);
        const expiration = decoded.exp;
        const now = Date.now()/1000;

        if (expiration < now){
            await refreshToken();
        }else{
            setAuthorized(true)
        }
    }

    if (authorized === null){
        return <div>Loading</div>
    }

    return authorized ? children : <Navigate to='/login/'/>
}

export default ProtectedRoute;