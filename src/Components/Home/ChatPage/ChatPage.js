import React, { useEffect, useRef, useState } from 'react';
import ChatBar from '../../ChatBar/ChatBar';
import ChatBody from '../../ChatBody/ChatBody';
import ChatFooter from '../../ChatFooter/ChatFooter';
import axios from 'axios';
import AllUserBar from "../../AllUserBar/AllUserBar"
import socketIO from 'socket.io-client';

const socket = socketIO.connect('http://localhost:5000/chat');

const ChatPage = () => {
  const [currentChat, setCurrentChat] = useState(null)
  const [receiver, setReceiver] = useState("");
  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [activeUser, setActiveUser] = useState([]);

  // const socket = useRef();

  // useEffect(() => {
  //   socket.current = io("http://localhost:5000");
  // }, [])
  const userId = localStorage.getItem("chatUserId")

  useEffect(() => {
    socket.on("message", (data) => {
      console.log(data);
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
      });
    });
  }, [socket]);

  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);




  useEffect(() => {
    const userId = localStorage.getItem("chatUserId");
    socket.emit("addUser", { userId, check: "check" });
    socket.on("getUsers", (users) => {
      setActiveUser(users);
    })
  }, [socket])

  const getMessages = () => {
    axios.get(`http://localhost:5000/message/getMessage/${currentChat?._id}`)
      .then(res => setMessages(res.data))
      .catch(err => console.log(err))
  }

  useEffect(() => {
    // get message 
    getMessages();
  }, [currentChat])



  return (
    <div className="chat">
      <ChatBar currentChat={currentChat} setCurrentChat={setCurrentChat} activeUser={activeUser} />
      <div className="chat__main">
        <header className="chat__mainHeader">
          <p>{receiver}</p>
        </header>
        {
          currentChat ?
            <>
              <ChatBody messages={messages} currentChat={currentChat} setUser={setReceiver} />
              <ChatFooter currentChat={currentChat} messages={messages} setMessages={setMessages} activeUser={activeUser} />
            </> :
            <>
              <p style={{ fontSize: "25px", textAlign: "center", marginTop: "20px" }}>Open a conversation to start chat</p>
            </>
        }
      </div>
      <AllUserBar currentChat={currentChat} setCurrentChat={setCurrentChat} activeUser={activeUser} />
    </div>
  );
};

export default ChatPage;