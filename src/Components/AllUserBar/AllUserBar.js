import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import ChatBarName from '../ChatBarName/ChatBarName';
import { useNavigate } from 'react-router-dom';
import socketIO from 'socket.io-client';

const socket = socketIO.connect('http://localhost:5000/chat');

const ChatBar = ({ setCurrentChat, activeUser }) => {
  const [allUser, setAllUser] = useState([]);
  const userId = localStorage.getItem("chatUserId");
  // const [activeUser, setActiveUser] = useState([]);


  // useEffect(() => {
  //   const userId = localStorage.getItem("chatUserId");
  //   socket.emit("addUser", userId);
  //   socket.on("getUsers", (users) => {
  //     setActiveUser(users);
  //   })
  // }, [socket])

  useEffect(() => {
    axios.get(`http://localhost:5000/user/getAllUser`)
      .then(res => {
        const result = res.data.filter(d => d._id !== userId);
        setAllUser(result)
      })
      .catch(err => console.log(err))
  }, [])

  const makeConversation = (receiverId) => {
    const data = {
      senderId: userId,
      receiverId
    }
    axios.post(`http://localhost:5000/conversation/newConversation`, data)
      .then(res => {
        console.log(res);
        if (res.data.members) {
          const data = {
            _id: res.data.insertedId,
            members: [userId, receiverId]
          }
          setCurrentChat(data)
        }
      }).catch(err => {
        console.log(err);
      })
  }

  const navigate = useNavigate();
  const handleLeaveChat = () => {
    navigate('/');
    localStorage.removeItem('chatUserName');
    localStorage.removeItem('chatUserId');
    window.location.reload();
  };

  const userName = localStorage.getItem("chatUserName");

  return (
    <div className="chat__sidebar">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <p style={{ fontSize: "18px", fontWeight: "700" }}>{userName}</p>
        <button className="leaveChat__btn" onClick={handleLeaveChat}>
          Log Out
        </button>
      </div>
      <div>
        <h4 className="chat__header">All Users</h4>
        <div className="chat__users">
          {allUser.map(c =>
            <div key={c._id} onClick={() => { makeConversation(c._id) }}>
              <div className='container'>
                {
                  (activeUser.find(u => u.userId == c._id)) ?
                    <p>{c.name} <span style={{ width: "10px", height: "10px", backgroundColor: "green", borderRadius: "50%", display: "inline-block" }}></span></p> : <p>{c.name}</p>
                }
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatBar;