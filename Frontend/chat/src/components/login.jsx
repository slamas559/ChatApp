import { useState } from "react"
import axios from "axios"
import './components.css'
import { useNavigate, Link } from "react-router-dom"


function Login(){

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate();

    const handleLogin = async(e)=>{
        e.preventDefault();
        try{
            const response = await axios.post("http://localhost:8000/login",{
                username,
                password,
            },{
                headers: {
                    "Content-Type": "application/json",
                },
                responseType: 'json'
            });
            console.log("logged in succesfully")
            navigate("/");
            localStorage.setItem("token", response.data.access_token);
            setUsername("")
            setPassword("")
        }catch(error){
            console.log("Error: " + error.response?.data?.detail || "Login failed")
        }
    }


    return(
        <div className="form">
            <form onSubmit={handleLogin}>
                <div className="inner">
                    <h2>Login</h2>
                    <div className="input" style={{marginTop: "50px"}}>
                        <input type="text" placeholder="Enter your username..." value={username}
                            onChange={(e)=>setUsername(e.target.value)}/>
                    </div>
                    <div className="input">
                        <input type="password" placeholder="Enter your password..." value={password}
                        onChange={(e)=>setPassword(e.target.value)}/>
                    </div>
                    <button type="submit">Submit</button>
                    <p>Don't have an account register <Link to={"/register"}>Here</Link></p>
                </div>
            </form>
        </div>
    )
}

export default Login