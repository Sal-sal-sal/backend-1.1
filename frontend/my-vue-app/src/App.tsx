import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'

import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Home from './page/wrapper'
import Read from './page/wrapperw'

function App() {

  return (
    <Routes>
      <Route path="/" element={<Read />} />
      {/* <Route path="/create" element={<Create />} />
      <Route path="/update" element={<Update />} />
      <Route path="/delete" element={<Delete />} /> */}
    </Routes>
  )
}

export default App
