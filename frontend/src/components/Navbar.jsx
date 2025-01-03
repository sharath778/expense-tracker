import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaPen, FaTrashAlt } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Navbar = () => {
    const date = new Date().getDate()+'-'+new Date().getMonth()+1+'-'+new Date().getFullYear();
    const userName = JSON.parse(localStorage.getItem('user')).name;
    const navigate = useNavigate();
    const [incomeBtn, setIncomeBtn] = useState(false);
    const [incomeData, setIncomeData] = useState({});
    const total= localStorage.getItem('daytotal');
    


    const getMonthlyIncome = async ()=>{
        try{
            const res = await axios.get("/api/track/get-monthly-income");
            if(res){
                setIncomeBtn(true);
                setIncomeData(res.data);                
            }
        }catch(e){
            console.error("Error from getMonthlyIncome()",e);
            
        }
    }

    useEffect(()=>{
        getMonthlyIncome();
    },[]);


    const handleLogout = async ()=>{
        try{
            const res = await axios.post("/api/users/logout",{});
            console.log(res)
            if(res.request.status === 200){
                localStorage.removeItem('user');
                localStorage.removeItem('daytotal');
                toast.success("logout was successful!");
                navigate("/");
            }
        }catch(e){
            console.error("Error from handleLogout()",e);
            toast.error("Error logging out!");
        }
        
    }
    
    return (
        <div className="min-h-screen flex flex-col bg-gray-100 fixed z-50">
            {/* Navbar */}
            <nav className="flex justify-between items-center bg-blue-600 text-white p-4 w-[100vw] fixed z-50">
                <div className="text-xl">{userName}</div>
                <div className="text-lg font-bold">Expense-Tracker</div>
                <button className="bg-red-500 px-4 py-2 rounded-full hover:bg-red-600" onClick={handleLogout}>Logout</button>
            </nav>

            {/* Body */}
            <div className='flex justify-between fixed top-16'>
                {/* Left Sidebar */}
                <div className="flex flex-col items-start px-4 sm:px-6 md:px-8 lg:px-12 h-[92vh] bg-gray-800 w-[35vh]">
                    <h3 className='text-xl font-bold text-white my-4 '>Track money</h3>
                    <ul className="list-none text-white ml-0 space-y-4">
                        <Link to="/dashboard"><li className='cursor-pointer hover:bg-gray-900 active:bg-gray-800 hover:text-white p-2 rounded-md transition duration-300 ease-in-out'>Add Entries</li></Link>
                        <div className=" border-t-[1px] border-cyan-300"></div>
                        <Link to="/daily-track"><li className='cursor-pointer hover:bg-gray-900 active:bg-gray-800 hover:text-white p-2 rounded-md transition duration-300 ease-in-out'>Day track</li></Link>
                        <div className=" border-t-[1px] border-cyan-300"></div>
                        <Link to="/monthly-track"><li className='cursor-pointer hover:bg-gray-900 active:bg-gray-800 hover:text-white p-2 rounded-md transition duration-300 ease-in-out'>Month track</li></Link>
                        <div className=" border-t-[1px] border-cyan-300"></div>
                        <Link to="/yearly-track"><li className='cursor-pointer hover:bg-gray-900 active:bg-gray-800 hover:text-white p-2 rounded-md transition duration-300 ease-in-out'>Year track</li></Link>
                        <div className=" border-t-[1px] border-cyan-50"></div>
                        <li>Day total: <strong>{total}</strong></li>
                        <div className=" border-t-[1px] border-cyan-300"></div>
                        {incomeBtn ? <>
                            <li>This month Income: <strong>{incomeData.income}</strong></li>
                        <div className=" border-t-[1px] border-cyan-300"></div>
                            <li>This month remaining: <strong>{incomeData.remainingAmount}</strong></li>
                        <li className='absolute bottom-3'>Date: {date}</li>
                        </>:
                            <Link to="/add-monthly-income"><li className='cursor-pointer mt-4 text-black bg-orange-200 hover:bg-gray-900 active:bg-gray-800 hover:text-white p-2 rounded-md transition duration-300 ease-in-out'>Add Monthly Income</li></Link>
                        }
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Navbar;