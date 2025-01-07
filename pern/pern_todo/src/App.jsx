import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Notes from "./components/Notes";
import { useEffect, useState } from "react";

const App = () => {

  const [token, setToken] = useState('')
  const [finalToken , setFinalToken] = useState('')

  useEffect(()=>{
    const newToken = localStorage.setItem("authToken",token);
    if(token){
      <Navigate to="/notes" />
    }else{
      <Navigate to="/login" />
    }
   
  },[token])



 
  return (
    <>
      <BrowserRouter>
      <Navbar />

        {
          !token ?
            <Routes>
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login setToken={setToken} />} />
            </Routes> :
            <Routes>
              <Route path="/notes" element={<Notes token={finalToken} />} />
            </Routes>
        }

      </BrowserRouter>
    </>
  );
};
//helllo
export default App;