import './App.css'

import React, { useState, useEffect, useRef } from 'react';
import socket from 'socket.io-client';
import { nanoid } from 'nanoid';
import { AiOutlineSend } from 'react-icons/ai';

// const socket = io.connect('http://localhost:5000');

const userName = nanoid(4);

function App() {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const socketClientRef = useRef(null);
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [chat]);

  const sendChat = (e) => {
    e.preventDefault();
    if (!message.length) return;
    socketClientRef.current.emit("chat", { message, userName })
    setMessage('');
  }

  useEffect(() => {
    const client = socket("https://chat-socket-ser.herokuapp.com/");
    client.on("chat", message => {
      setChat(prevChats => [...prevChats, message])
    });
    socketClientRef.current = client
    return () => {
      client.removeAllListeners()
    }
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <div className="header">
          <h1 className="heading">Chatty App</h1>
          <p>{userName}</p>
        </div>

        {chat && chat.map((payload, index) => {
          return (
            <>
              <div ref={messagesEndRef} className={`${userName === payload.userName ? 'sender' : 'receiver'}`}>
                <p key={index}>{payload.message}</p>
                {userName !== payload.userName && (
                  <span>{payload.userName}</span>
                )}
              </div>
            </>
          )
        })}

        <form onSubmit={sendChat}>
          <input
            type="text"
            name="chat"
            placeholder="send text"
            value={message}
            onChange={e => setMessage(e.target.value)}
          />

          <button className="btnSend" type="submit">
            <AiOutlineSend />
          </button>
        </form>
      </header>
    </div>
  );
}

export default App;
