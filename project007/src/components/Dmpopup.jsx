import React, { useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client';
import { useNavigate } from "react-router-dom";
import axios from 'axios';


const Dmpopup = () => {
 
  const socket = useMemo(()=>io('http://localhost:3000'),[]);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [room, setRoom] = useState("");
  const [socketId, setSocketId] =useState('')
  const navigate = useNavigate()
  
// Fetch messages from the server on component mount
useEffect(() => {
  // Fetch existing messages from backend on initial load
  axios.get('http://localhost:3000/profile/chats/getMessages')
    .then((response) => {
      setMessages(response.data);  // Store retrieved messages
    })
    .catch((error) => {
      console.error("Error fetching messages: ", error);
    });

  // Listen for incoming messages from other clients
  socket.on('message', (data) => {
    console.log(data)
    setSocketId(socket._id)
    console.log(socketId)
    setMessages((prev) => [...prev, data]); 
  });

  // Cleanup socket connection on component unmount
  return () => {
    socket.disconnect();
  };
}, []);
 
const sendMessage = () => {
  if (message.trim()) {
    // Emit message to the server
    const newMessage = { sender: socketId , content: message };
    socket.emit('message', newMessage);

    // Save message to the backend
    axios.post('http://localhost:3000/sendMessage', {
      sender ,  // Example sender, replace with actual username or user data
      content
    })
    .then((response) => {
      setMessages((prev) => [...prev, response.data]);
    })
    .catch((error) => {
      console.error("Error sending message: ", error);
    });

    setMessage('');  // Clear input field
  }
};

  return (
    
      <div data-layer="dmPopUp" className="Dmpopup w-screen h-screen p-2.5 bg-neutral-300 rounded-2xl justify-start items-center gap-2.5 inline-flex overflow-hidden">
        
  <div data-layer="dmSection" className="Dmsection w-80 h-full pl-5 pt-3.5 bg-gray-50 rounded-2xl flex-col justify-center items-start gap-16 inline-flex">
    <div>
      <button className=' rounded-2xl  text-gray-900 ' onClick={()=> navigate('/profile/confessions')}> back to home </button>
    </div>
    <div data-layer="yourMsgs" className="Yourmsgs w-80 justify-start items-center gap-6 inline-flex">
      <div data-layer="imgpic" className="Imgpic w-14 h-14 p-6 bg-gray-900 rounded-full justify-center items-center gap-2 flex overflow-hidden">
        <div data-layer="_base-logo" className="BaseLogo grow shrink basis-0 self-stretch justify-center items-center gap-2 flex" />
      </div>
      <div data-layer="username" className="Username grow shrink basis-0 flex-col justify-start items-start gap-4 inline-flex">
        <div data-layer="Rectangle 5667" className="Rectangle5667 w-36 h-4 bg-gray-400 rounded-full" />
        <div data-layer="Rectangle 5668" className="Rectangle5668 w-44 h-4 bg-zinc-200 rounded-full" />
      </div>
    </div>
    <div data-layer="dmsMsgs" className="Dmsmsgs w-72 h-4/6 flex-col justify-start items-start gap-3 flex">
      <div data-layer="userdm" className="Userdm self-stretch justify-start items-center gap-7 inline-flex">
        <div data-layer="Userimg" className="Userimg w-16 h-16 bg-zinc-200 rounded-full" />
        <div data-layer="username" className="Username flex-col justify-start items-start gap-4 inline-flex">
          <div data-layer="Rectangle 5671" className="Rectangle5671 w-36 h-4 bg-gray-400 rounded-full" />
          <div data-layer="Rectangle 5672" className="Rectangle5672 w-24 h-4 bg-zinc-200 rounded-full" />
        </div>
      </div>
      <div data-layer="userdm" className="Userdm self-stretch justify-start items-center gap-7 inline-flex">
        <div data-layer="userImg" className="Userimg w-16 h-16 bg-zinc-200 rounded-full" />
        <div data-layer="username" className="Username flex-col justify-start items-start gap-4 inline-flex">
          <div data-layer="Rectangle 5673" className="Rectangle5673 w-44 h-4 bg-gray-400 rounded-full" />
          <div data-layer="Rectangle 5674" className="Rectangle5674 w-36 h-4 bg-zinc-200 rounded-full" />
        </div>
      </div>    
      <div data-layer="userdm" className="Userdm self-stretch justify-start items-center gap-7 inline-flex">
        <div data-layer="Ellipse 506" className="Ellipse506 w-16 h-16 bg-zinc-200 rounded-full" />
        <div data-layer="Frame 1000002097" className="Frame1000002097 flex-col justify-start items-start gap-4 inline-flex">
          <div data-layer="Rectangle 5675" className="Rectangle5675 w-28 h-4 bg-gray-400 rounded-full" />
          <div data-layer="Rectangle 5676" className="Rectangle5676 w-40 h-4 bg-zinc-200 rounded-full" />
        </div>
      </div>
      <div data-layer="userdm" className="Userdm self-stretch justify-start items-center gap-7 inline-flex">
        <div data-layer="Ellipse 507" className="Ellipse507 w-16 h-16 bg-zinc-200 rounded-full" />
        <div data-layer="Frame 1000002099" className="Frame1000002099 flex-col justify-start items-start gap-4 inline-flex">
          <div data-layer="Rectangle 5677" className="Rectangle5677 w-36 h-4 bg-gray-400 rounded-full" />
          <div data-layer="Rectangle 5678" className="Rectangle5678 w-28 h-4 bg-zinc-200 rounded-full" /> 
        </div>
      </div>
      <div data-layer="userdm" className="Userdm self-stretch justify-start items-center gap-7 inline-flex">
        <div data-layer="Ellipse 508" className="Ellipse508 w-16 h-16 bg-zinc-200 rounded-full" />
        <div data-layer="Frame 1000002101" className="Frame1000002101 flex-col justify-start items-start gap-4 inline-flex">
          <div data-layer="Rectangle 5679" className="Rectangle5679 w-32 h-4 bg-gray-400 rounded-full" />
          <div data-layer="Rectangle 5680" className="Rectangle5680 w-24 h-4 bg-zinc-200 rounded-full" />
        </div>
      </div>
      <div data-layer="userdm" className="Userdm self-stretch justify-start items-center gap-7 inline-flex">
        <div data-layer="Ellipse 508" className="Ellipse508 w-16 h-16 bg-zinc-200 rounded-full" />
        <div data-layer="Frame 1000002101" className="Frame1000002101 flex-col justify-start items-start gap-4 inline-flex">
          <div data-layer="Rectangle 5679" className="Rectangle5679 w-32 h-4 bg-gray-400 rounded-full" />
          <div data-layer="Rectangle 5680" className="Rectangle5680 w-24 h-4 bg-zinc-200 rounded-full" />
        </div>
      </div>
    </div>
  </div>
  <div data-layer="chatSec" className="Chatsec  w-full h-full px-4 py-2.5 bg-white rounded-2xl justify-center items-end gap-4 overflow-hidden flex flex-col">
   
        {/* Real-time messages */}
        <div className="w-full flex-grow flex-col-reverse overflow-y-auto" 
               style={{
                 display: 'flex',
                 flexDirection: 'column-reverse',
                 overflowY: 'auto',
               }}>
            {messages.map((msg, index) => (
              <div key={index} className="p-2 bg-gray-800 text-white rounded-lg mb-2">
                {msg.content}
              </div>
            ))}
          </div>

   
    
    <div className='flex w-full gap-4 justify-start items-center'>
    
        <input id='messageinput' type="text" data-layer="typingBar" className="Typingbar w-full h-10 p-2.5 bg-gray-200 rounded-2xl outline-none  " placeholder='type your text... 'value={message}
          onChange={(e) => setMessage(e.target.value)}/>
        <button id='sendBtn' data-layer="audiobtn" className="Audiobtn w-12 h-12 p-2 bg-red-900 rounded-full justify-center items-center gap-2 flex overflow-hidden" onClick={sendMessage}>send</button>
        <button data-layer="audiobtn" className="Audiobtn w-12 h-12 p-2 bg-yellow-400 rounded-full justify-center items-center gap-2 flex overflow-hidden" ></button>

    </div>
    

   
   
  </div>
</div>
    
  )
}
export default Dmpopup