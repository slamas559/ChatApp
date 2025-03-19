import React, {useState, useEffect } from "react";
import axios from "axios";
import Home from "./home";
import { FormatDate } from "../FormatDate";
import {Link, Outlet, useParams, useNavigate } from "react-router-dom";

function Dashboard() {

    const {id} = useParams();
    const [online, setOnline] = useState([])
    const [users, setUsers] = useState([])
    const myToken = localStorage.getItem("token")
    const [token, setToken] = useState(myToken);
    const navigate = useNavigate()


    const showUsers = async()=>{
        const result = await axios.post(`http://localhost:8000/users/${token}`,{
            token: token
        }
        ,{
            headers: {
                "Content-Type": "application/json",
            }
        })
        setUsers(result.data)
        // console.log(users)
    }

    const showOnline = async()=>{
        const result = await axios.get(`http://localhost:8000/online`)
        setOnline(result.data)
        // console.log(online)
    } 
    useEffect(()=>{
        showUsers();
        showOnline();
    },[])

    const logout = ()=>{
        localStorage.removeItem("token");
        navigate("/login")
    }

    const check = (num)=>{
        if(online.includes(num)){
            return true
        }else{
            return false
        }
    }
    return(
        <div className="container">
            <div className="sub-container">
                <div className="chat-list">
                    <h3>Chat List</h3>
                    <div className="user-list">
                        {users.map((user, index)=>(
                            <Link to={`/chat/${user.id}`} key={index}>
                                <div className="ind">
                                    <div className="img">
                                        <img src="../src/assets/default.jpg"/>
                                        <div style={{display:check(user.id)?"block":"none"}} className="dot-online"></div>
                                    </div>
                                    <p>{user.username}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                    <div className="logout">
                        <button onClick={logout}>Logout</button>
                    </div>
                </div>
                <div className="chat-body">
                    <Outlet/>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;