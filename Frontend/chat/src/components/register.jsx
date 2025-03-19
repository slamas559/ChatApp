import { useState } from "react"
import './components.css'
import axios from "axios"
import { Link } from "react-router-dom"

function Register(){

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [token, setToken] = useState("")

    const handleRegister = async (e) => {
        e.preventDefault();
        try{
            const response = await axios.post("http://localhost:8000/register",{
                username,
                password,
            },{
                headers:{
                    "Content-Type": "application/json"
                }
            });
            setUsername("")
            setPassword("")
            console.log("registered")
        }catch(error){
            console.log("Error: "+ error.response?.data?.detail || "Registration failed")
        }
    }

    return(
        <div className="form">
            <form onSubmit={handleRegister}>
                <div className="inner">
                    <h2>Register</h2>
                    <div className="input" style={{marginTop: "50px"}}>
                        <input type="text" placeholder="Enter your username..." value={username}
                            onChange={(e)=>setUsername(e.target.value)}/>
                    </div>
                    <div className="input">
                        <input type="password" placeholder="Enter your password..." value={password}
                        onChange={(e)=>setPassword(e.target.value)}/>
                    </div>
                    <button type="submit">Submit</button>
                    <p style={{fontSize:"14px"}}>Already have an account click <Link to={"/login"}>Here</Link> to login</p>
                </div>
            </form>
        </div>
    )
}

export default Register