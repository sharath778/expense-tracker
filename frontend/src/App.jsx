import './App.css';
import {Routes ,Route} from "react-router-dom";
import { ToastContainer } from 'react-toastify';

import LandingPage from './pages/LandingPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import Dashboard from './pages/Dashboard.jsx';
import DailyTrackPage from './pages/DailyTrackPage.jsx';
import MonthlyTrackPage from './pages/MonthlyTrackPage.jsx';
import YearlyTrackPage from './pages/YearlyTrackPage.jsx';
import MonthlyIncomeForm from './components/MonthlyIncomeForm.jsx';
import { useEffect, useState } from 'react';

function App() {
  const [user,setuser] = useState("");
  useEffect(() =>{
    const ur = localStorage.getItem('user');
    if(ur){
      setuser(ur);
    } else {
      setuser("");
    }
  },[]);
  

  return (
    <>
    <ToastContainer/>
    <Routes>
      <Route  path="/" element={<LandingPage />} />
      <Route  path="/login" element={<LoginPage/>}/>
      <Route  path="/signup" element={<SignupPage/>}/>
      <Route  path="/dashboard" element={user ? <Dashboard/> : <LandingPage/>}/>
      <Route path="/daily-track" element={user ? <DailyTrackPage /> : <LandingPage />}/>
      <Route path="/monthly-track" element={user ? <MonthlyTrackPage /> : <LandingPage />}/>
      <Route path="/yearly-track" element={user ? <YearlyTrackPage /> : <LandingPage />}/>
      <Route path="/add-monthly-income" element={user ? <MonthlyIncomeForm/> : <LandingPage />} />
    </Routes>
    </>
  )
}

export default App
