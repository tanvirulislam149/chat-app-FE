import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ChatBody = ({ messages, setUser, currentChat }) => {

  const userId = localStorage.getItem("chatUserId");

  useEffect(() => {
    const friendId = currentChat?.members?.find(id => id !== userId)
    axios.get(`http://localhost:5000/user/getUser/${friendId}`)
      .then(res => {
        setUser(res.data.name)
      }).catch(err => {
        console.log(err);
      })
  }, [currentChat])


  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages]);

  return (
    <>
      {/*This shows messages sent from you*/}
      <div className="message__container">
        {messages.map((message) =>
          message.senderId === localStorage.getItem('chatUserId') ? (
            <div className="message__chats" key={message._id}>
              {/* <p className="sender__name">You</p> */}
              <div className="message__sender">
                <p>{message.text}</p>
              </div>
            </div>
          ) : (
            <div className="message__chats" key={message._id}>
              <p>{message.name}</p>
              <div className="message__recipient">
                <p>{message.text}</p>
              </div>
            </div>
          )
        )}

        {/*This is triggered when a user is typing*/}
        <div className="message__status">
          {/* <p>Someone is typing...</p> */}
        </div>
        <div ref={messagesEndRef} />
      </div>
    </>
  );
};

export default ChatBody;