<<<<<<< HEAD
import React, { useCallback, useEffect, useState } from 'react'
=======
import React, { useState } from 'react'
>>>>>>> c7f649d7ae415e2cc30918a7f0c7ba5189433a0e
import Layout from '../Layout/Layout'
import './JoinRoom.css'
import { v4 as uuidv4, validate } from 'uuid';
import { Toaster, toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
<<<<<<< HEAD
import { useSocket } from '../../context/SocketProvider';
=======
>>>>>>> c7f649d7ae415e2cc30918a7f0c7ba5189433a0e


const JoinRoom = () => {
    const navigate = useNavigate();
<<<<<<< HEAD
    const socket = useSocket();
    const [roomId, setRoomId] = useState("");
    const [username, setUsername] = useState("");

    const handleSubmit = useCallback((e)=>{
=======
    const [roomId, setRoomId] = useState("");
    const [username, setUsername] = useState("");

    const handleSubmit = (e) => {
>>>>>>> c7f649d7ae415e2cc30918a7f0c7ba5189433a0e
        e.preventDefault();
        if (!validate(roomId)) {
            toast.error('Invalid roomID');
            return;
        }
<<<<<<< HEAD
        if (!username) {
            toast.error('Please enter username');
            return;
        }
        socket.emit('room:join', {username, roomId})
    },[username,roomId,socket])
    const handleJoinRoom = useCallback((data) =>{
        const {username, roomId} = data
        navigate(`/room/${roomId}`, { state: { username } })
     },[navigate])
     useEffect(() =>{
        socket.on('room:join',handleJoinRoom);
        return () =>{
          socket.off('room:join')
        }
       },[socket, handleJoinRoom]);
=======
        username && navigate(`/room/${roomId}`, { state: { username } })
    }

>>>>>>> c7f649d7ae415e2cc30918a7f0c7ba5189433a0e
    const createRoomId = () => {
        try {
            setRoomId(uuidv4());
            toast.success('Room Created');
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Layout>
            <div className="joinBoxWrapper">
                <form className="joinBox" onSubmit={handleSubmit}>
                    <p>Paste your invitation code down below</p>
                    <div className='joinBoxInputWrapper'>
                        <input
                            type="text"
                            className='joinBoxInput'
                            id='roomIdInput'
                            placeholder='Enter Room ID'
                            value={roomId}
                            onChange={(e) => setRoomId(e.target.value)}
                        />
                        <label htmlFor="roomIdInput" className='joinBoxWarning'>
                            {roomId ? '' : 'Room ID required'}
                        </label>
                    </div>
                    <div className='joinBoxInputWrapper'>
                        <input
                            type="text"
                            className='joinBoxInput'
                            id='usernameInput'
                            placeholder='Enter Username'
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <label htmlFor="usernameInput" className='joinBoxWarning'>
                            {username ? '' : 'Room ID required'}
                        </label>
                    </div>
                    <button type='submit' className='joinBoxBtn'>Join</button>
                    <p>Don't have invite code?
                        Create your <span onClick={createRoomId} style={{ textDecoration: 'underline', cursor: 'pointer' }}>
                            own room</span></p>
                </form>
                <Toaster />
            </div>
        </Layout>
    )
}

export default JoinRoom