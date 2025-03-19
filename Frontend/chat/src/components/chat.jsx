import React, {useState, useEffect } from "react";
import axios from "axios";
import { FormatDate } from "../FormatDate";
import { useParams } from "react-router-dom";

function Chat(){

    const myToken = localStorage.getItem("token")
    const [messages, setMessages] = useState([])
    const [input, setInput] = useState("");
    const [token, setToken] = useState(myToken);
    const [socket, setSocket] = useState(null)
    const [receive, setReceive] = useState("")
    const [sent, setSent] = useState("")
    const {id} = useParams();
    const [receiverName, setReceiverName] = useState("")
    const [receiver, setReceiver] = useState(id);


    useEffect(()=>{
        if(token){
            const ws = new WebSocket(`ws://localhost:8000/ws/chat/${token}`);
            setSocket(ws) 

            ws.onmessage = (event) => {
                const data = JSON.parse(event.data)
                setSent(data)
                console.log("sent")
        };

            // return () => ws.close();
        };
    },[token])

    const handle = async()=>{
        try{
            const result = await axios.post(`http://localhost:8000/chat/${token}`,{
                receiver_id: id,
                token: token
            },{
                headers: {
                    "Content-Type": "application/json",
                }
            })
            setMessages(result.data)
            const name = result.data[0].receiver_id == id ? result.data[0].receiver_name : result.data[0].sender_name
            setReceiverName(name)
            // console.log(name)
        }catch(error){
            console.log("error", error)
        }
    }

    useEffect(() => {
        if(token){
            handle()
        }
    },[sent, id])

    const sendMessage = ()=>{
        if (socket){
            socket.send(JSON.stringify({message: input, receiver_id: Number(id)}));
            setInput("")
            // setSent("sent")
            handle();
        }
    };

    return(   
        <div>
            <div className="receiver-info">
                <h2>{receiverName}</h2>
            </div>
            <div className="show-messages">
                {messages.map((msg, index) => (
                    <div style={{justifyItems: msg.receiver_id == id ? "right":"left"}} className="message-box-container" key={index}>
                        <div style={{backgroundColor: msg.receiver_id == id ? "blueviolet":"black"}} className="message-box">
                            <p>{msg.content} <span>{FormatDate(msg.timestamp)}</span></p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="sending">
                <input type="text" 
                    value={input} 
                    placeholder="enter message"
                    className="message" 
                    onChange={(e)=>setInput(e.target.value)} />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>      
    )
}

export default Chat
