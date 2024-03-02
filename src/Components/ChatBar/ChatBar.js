import axios from 'axios';
import React, { useEffect, useState } from 'react';
import ChatBarName from '../ChatBarName/ChatBarName';
import { BiConversation } from "react-icons/bi";
import { FiUsers } from "react-icons/fi";
import { Box, Button, Drawer, List, ListItem } from '@mui/material';
import socketIO from 'socket.io-client';

const socket = socketIO.connect('http://localhost:5000/chat');



const ChatBar = ({ setCurrentChat, currentChat, activeUser }) => {
  const [conversation, setConversation] = useState([]);
  const [allUser, setAllUser] = useState([]);
  // const [activeUser, setActiveUser] = useState([]);

  // useEffect(() => {
  //   const userId = localStorage.getItem("chatUserId");
  //   socket.emit("addUser", userId);
  //   socket.on("getUsers", (users) => {
  //     setActiveUser(users);
  //   })
  // }, [socket])


  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });
  const [state2, setState2] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };
  const toggleDrawer2 = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState2({ ...state, [anchor]: open });
  };


  const list = (anchor) => (
    <Box
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 200 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {conversation.map((c, index) => (
          <ListItem key={c._id} disablePadding>
            <div style={{ width: "100%", margin: "10px" }} onClick={() => { setCurrentChat(c) }}>
              <ChatBarName conversation={c} />
            </div>
          </ListItem>
        ))}
      </List>
    </Box>
  );
  const list2 = (anchor) => (
    <Box
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 200 }}
      role="presentation"
      onClick={toggleDrawer2(anchor, false)}
      onKeyDown={toggleDrawer2(anchor, false)}
    >
      <List>
        {allUser.map((c, index) => (
          <ListItem key={c._id} disablePadding>
            <div style={{ width: "100%", margin: "10px" }} key={c._id} onClick={() => { makeConversation(c._id) }}>
              <div className='container'>
                {
                  (activeUser.find(u => u.userId == c._id)) ?
                    <p>{c.name} <span style={{ width: "10px", height: "10px", backgroundColor: "green", borderRadius: "50%", display: "inline-block" }}></span></p> : <p>{c.name}</p>
                }
              </div>
            </div>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const userId = localStorage.getItem("chatUserId");

  useEffect(() => {
    axios.get(`http://localhost:5000/conversation/getConversation/${userId}`)
      .then(res => {
        if (res.data.length) {
          setConversation(res.data)
        }
      }).catch(err => {
        console.log(err);
      })
  }, [userId, currentChat])

  //
  // For all user mobile sidebar


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

  const [open, setOpen] = React.useState(false);

  const toggleDrawerActive = (newOpen) => () => {
    setOpen(newOpen);
  };



  return (
    <>
      <div className="chat__sidebar">
        <p style={{ fontSize: "25px", fontWeight: "700", marginBottom: '15px' }}>ChitChat</p>
        <div>
          <h4 className="chat__header">Conversations</h4>
          <div className="chat__users">
            {conversation.map(c =>
              <div key={c._id} onClick={() => { setCurrentChat(c) }}>
                <ChatBarName conversation={c} />
              </div>
            )}
          </div>
        </div>
      </div>
      <div className='mobileSidebar'>
        <div>
          {['left'].map((anchor) => (
            <React.Fragment key={anchor}>
              <Button onClick={toggleDrawer(anchor, true)}>
                <BiConversation style={{ height: "40px", width: "40px" }} />
              </Button>
              <Drawer
                anchor={anchor}
                open={state[anchor]}
                onClose={toggleDrawer(anchor, false)}
              >
                <div style={{ marginTop: "30px", backgroundColor: "#f9f5eb" }}>
                  <h4 className="chat__header">Conversations</h4>
                  {list(anchor)}
                </div>
              </Drawer>
            </React.Fragment>
          ))}
          {['left'].map((anchor) => (
            <React.Fragment key={anchor}>
              <Button onClick={toggleDrawer2(anchor, true)}>
                <FiUsers style={{ height: "40px", width: "40px" }} />
              </Button>
              <Drawer
                anchor={anchor}
                open={state2[anchor]}
                onClose={toggleDrawer2(anchor, false)}
              >
                <div style={{ marginTop: "30px", backgroundColor: "#f9f5eb" }}>
                  <h4 className="chat__header">All Users</h4>
                  {list2(anchor)}
                </div>
              </Drawer>
            </React.Fragment>
          ))}
        </div>
      </div>
    </>
  );
};

export default ChatBar;