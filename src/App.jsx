import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './components/pages/Home'
import Singnin from './components/pages/Signin'
import Signup from './components/pages/Signup'

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/signin' element={<Singnin />} />
                <Route path='/signup' element={<Signup />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App