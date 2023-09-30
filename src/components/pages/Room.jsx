import React, { useEffect, useRef, useState } from 'react'
import AceEditor from 'react-ace'
import { useParams } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast'
import './Room.css'
import io from 'socket.io-client'
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-typescript";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-yaml";
import "ace-builds/src-noconflict/mode-golang";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/mode-css";
import "ace-builds/src-noconflict/keybinding-emacs";
import "ace-builds/src-noconflict/keybinding-vim";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/ext-searchbox";
import { ChatBot } from '../ChatBot'


const Room = () => {



    const [socket,setsocket]=useState();

    useEffect(()=>{
       
                const socket = io('http://localhost:8080');
        console.log(socket);
       setsocket(socket)
              
                return ()=>{
        setsocket(null);
        
                }
            },[])
    const { roomId } = useParams()
    const [language, setLanguage] = useState('javascript');
    const [codeKeyBinding, setCodeKeyBinding] = useState(undefined);
    const [fetchedUsers, setFetchedUsers] = useState(["sam", "raja", "divyang"]);

    const languagesAvailable = ["javascript", "typescript", "python", "java", "yaml", "golang", "c_cpp", "html", "css"]
    const codeKeyBindingsAvailable = ["default", "emacs", "vim"];
     
    const [code,setcode]=useState("");

    const AceEditorRef=useRef(null);

    const [input,setinput]=useState('');

    const [output,setoutput]=useState('');
    var qs = require('qs');

    const handleLanguage = (e) => {
        setLanguage(e.target.value);
    }
    const handleCodeKeyBinding = (e) => {
        setCodeKeyBinding(e.target.value === 'default' ? undefined : e.target.value);
    }

    const generateRandomColor = (str) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        let color = '#';
        for (let i = 0; i < 3; i++) {
            let value = (hash >> (i * 8)) & 0xff;
            color += value.toString(16).padStart(2, '0');
        }
        return color;
    }

    const copyToClipboard = (text) => {
        try {
            navigator.clipboard.writeText(text)
            toast.success('Copied to clipboard')
        } catch (error) {
            console.log(error)
        }
    }


    function handleChange(change){

        setcode(change);

        if(socket){


            socket.emit('codechange',{code:change})
        }

     

    }


  

        

    useEffect(()=>{

        if(socket  !=null){

            socket.on('codeadded',(codeData)=>{

              console.log(codeData.code);
      const newText=codeData.code
    setcode(newText);
              
    
            })

            socket.on('outputchange',(outputData)=>{

                setoutput(outputData)
            })

            socket.on('inputchange',(inputData)=>{
                setinput(inputData)
            })
    

        }
       
        
    })


    useEffect(()=>{
        

        if(output && socket){

            socket.emit('outputchange',output);

        }
        
    },[output,socket])

    function InputHandler(event){

        socket.emit('inputchange',event.target.value);

        setinput(event.target.value)



    }


    



    const compile = () => {
console.log(code);

console.log(language);
        var data = qs.stringify({
            'code': code,
            'language': language,
            'input': input
        });
console.log(data);

        console.log(code);
        var config = {
            method: 'post',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body : data
        };
        fetch('https://api.codex.jaagrav.in',config)
        .then(res => res.json())
        .then(data => {
            if(data['error'].length==0) {
                // setTc(true)
           setoutput(data['output']);
                
                toast.success("compiled sucessfully")
                console.log(data['output']);
                // setOutput(data['output'])
            }
            else {
                // setTc(false)
                toast.error("compilation error")
                setoutput(data['error'])
            }
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    console.log(code);
    return (
        <div className='room'>
            <div className="roomSidebar">
                <div className="roomSidebarUsersWrapper">
                    <div className="languageFieldWrapper">
                        <select
                            className='languageField'
                            name="language"
                            id="language"
                            onChange={handleLanguage}
                            value={language}
                        >
                            {
                                languagesAvailable.map((lang) => {
                                    return (
                                        <option key={lang} value={lang}>{lang}</option>
                                    )
                                })
                            }
                        </select>
                    </div>
                    <div className="languageFieldWrapper">
                        <select
                            className='languageField'
                            name="codeKeyBinding"
                            id="codeKeyBinding"
                            value={codeKeyBinding}
                            onChange={handleCodeKeyBinding}
                        >
                            {
                                codeKeyBindingsAvailable.map((each) => {
                                    return (
                                        <option key={each} value={each}>{each}</option>
                                    )
                                })
                            }
                        </select>
                    </div>
                    <p>Connected Users:</p>
                    <div className="roomSidebarUsers">
                        {
                            fetchedUsers.map((eachUser) => (
                                <div
                                    key={eachUser}
                                    className="roomSidebarUsersEach"
                                >
                                    <div
                                        className='roomSidebarUsersEachAvatar'
                                        style={{
                                            backgroundColor: `${generateRandomColor(eachUser)}`,
                                        }}
                                    >{eachUser.slice(0, 2).toUpperCase()}</div>
                                    <div className='roomSidebarUsersEachName'>{eachUser}</div>
                                </div>
                            )
                            )
                        }
                    </div>
                    <button className='roomSidebarCopyBtn' onClick={() => {
                        copyToClipboard(roomId)
                        console.log(roomId)
                    }}>Copy Room ID</button>
                    <button className='roomSidebarBtn'>Leave</button>
                    <button onClick={compile}  className='roomSidebarBtn'>Run</button>

             <input
            type="text"
            id="input"
            name="input"
            placeholder='enter input'
            value={input}
            onChange={InputHandler}
          />

            <input
            type="text"
            id="output"
            name="output"
            placeholder='o/p'
            value={output}
          
          />
 
          
<ChatBot socket={socket}/>





                </div>
            </div>
            <AceEditor
            ref={AceEditorRef}
 setOptions={{ useWorker: false }}
 placeholder='Write your code here'
                className='roomCodeEditor'
                mode={language}
                keyboardHandler={codeKeyBinding}
                theme='monokai'
                name='collabEditor'
                width='auto'
                height='auto'
                fontSize={15}
                showPrintMargin={true}
                showGutter={true}
                highlightActiveLine={true}
                enableLiveAutocompletion={true}
                enableBasicAutocompletion={false}
                enableSnippets={false}
                wrapEnabled={true}
                tabSize={2}
                editorProps={{
                    $blockScrolling: true
                }}
                value={code}
                onChange={(change)=>handleChange(change)}
                
            />
            <Toaster />
        </div>
    )
}

export default Room