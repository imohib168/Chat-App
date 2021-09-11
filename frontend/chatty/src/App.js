import './App.css'

import React, { useState, useEffect, useRef } from 'react';
import socket from 'socket.io-client';
import { nanoid } from 'nanoid';

// const socket = io.connect('http://localhost:5000');

const userName = nanoid(4);

function App() {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const socketClientRef = useRef();

  const sendChat = (e) => {
    e.preventDefault();
    socketClientRef.current.emit("chat", { message, userName })
    setMessage('');
  }

  useEffect(() => {
    const client = socket("http://localhost:5000");
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
        <h1>Chatty App</h1>

        {chat && chat.map((payload, index) => {
          return (
            <>
              <div className={`${userName === payload.userName ? 'sender' : 'receiver'}`}>
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

          <button disabled={!message} type="submit">Send</button>
        </form>
      </header>
    </div>
  );
}

export default App;
