import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import io from "socket.io-client"
const socket = io.connect('http://localhost:5000/chat')

const ChatFooter = ({ currentChat, messages, setMessages, activeUser }) => {
  const [newMessage, setNewMessage] = useState('');
  const userId = localStorage.getItem("chatUserId")

  const receiverId = currentChat.members.find(
    (member) => member !== userId
  );


  const handleSendMessage = (e) => {
    e.preventDefault();
    const data = {
      senderId: userId,
      conversationId: currentChat._id,
      text: newMessage
    }

    const user = activeUser.find(u => u.userId == receiverId);
    console.log(user);
    if (user) {
      socket.emit("sendMessage", {
        senderId: userId,
        receiverId: receiverId,
        text: newMessage,
        room: user.socketId
      });
    }

    axios.post("http://localhost:5000/message/addMessage", data)
      .then(res => {
        if (res.data) {
          // getMessages()
          setMessages([...messages, data])
        }
      })
      .catch(err => console.log(err))
    setNewMessage('');
  };


  return (
    <div className="chat__footer">
      <form className="form" onSubmit={handleSendMessage}>
        <input
          type="text"
          placeholder="Write message"
          className="message"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button className="sendBtn">SEND</button>
      </form>
    </div>
  );
};

export default ChatFooter;