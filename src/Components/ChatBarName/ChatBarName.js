import React, { useEffect, useState } from 'react'
import styles from "./ChatBarName.css"
import axios from 'axios'

const ChatBarName = ({ conversation }) => {
  const [user, setUser] = useState("")
  const userId = localStorage.getItem("chatUserId");

  useEffect(() => {
    const friendId = conversation?.members?.find(id => id !== userId)
    axios.get(`http://localhost:5000/user/getUser/${friendId}`)
      .then(res => {
        setUser(res.data.name)
      }).catch(err => {
        console.log(err);
      })
  }, [conversation])


  return (
    <div className='container'>
      <p>{user}</p>
    </div>
  )
}

export default ChatBarName