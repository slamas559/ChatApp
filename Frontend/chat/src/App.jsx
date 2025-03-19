import './App.css'
import Dashboard from './components/dashboard'
import Chat from './components/chat'
import Login from './components/login'
import Register from './components/register'
import Home from './components/home'
import React, { useState, useEffect } from "react"
import axios from "axios"
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'



function App() {

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route element={<Dashboard/>}>
            <Route path="/" element={<Home/>} />
            <Route path="chat/:id" element={<Chat/>} />
          </Route>
          <Route path="/register" element={<Register/>} />
          <Route path="/login" element={<Login/>} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
