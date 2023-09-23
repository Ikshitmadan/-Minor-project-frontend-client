import React, { useEffect, useState } from 'react'
import Layout from '../Layout/Layout'
import { useRef } from 'react'
import io from 'socket.io-client'
import { ChatBot } from '../ChatBot'

const Home = () => {

    const [socket,setsocket]=useState();

    useEffect(()=>{
       
                const socket = io('http://localhost:8080');
        console.log(socket);
       setsocket(socket)
              
                return ()=>{
        setsocket(null);
        
                }
            },[])

    return (
        <div>
<ChatBot socket={socket}/>

            
</div>
    )
}

export default Home