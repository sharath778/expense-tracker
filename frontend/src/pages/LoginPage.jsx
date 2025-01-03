import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';


import loginImage from "../assets/images/authImage.png";
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Handle form submission logic here
        try{
            const response = await axios.post("/api/users/login",{email:formData.email, password:formData.password});
            if(response.data.user){
                toast.success("Logged in successfully!");
                localStorage.setItem('user', JSON.stringify({name:response.data.user.name, id:response.data.user._id}));
                navigate("/dashboard");
            }

        }catch(e){
            toast.error("Invalid credentials!");
            console.error("Error in login", e);
        }finally{
            setLoading(false);
        }

        
    };

    return (
        <div className="relative h-screen bg-cover bg-center" style={{ backgroundImage: `url(${loginImage})` }}>
            {/* Semi-transparent overlay */}
            <div className="absolute inset-0 bg-black opacity-40 z-0"></div>

            <div className="flex items-center justify-center min-h-screen opacity-100 z-10 relative">
                <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                    <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                                />
                                <span
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>
                        </div>
                        {loading ? 
                        <div
                            
                            className="w-full bg-blue-500 text-center text-white font-bold py-2 rounded transition duration-300 ease-in-out"
                        >
                            Loging...
                        </div>:
                        <button
                            type="submit"
                            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 rounded transition duration-300 ease-in-out"
                        >
                            Login
                        </button>}
                    </form>
                    <p className="mt-6 text-sm text-center text-gray-600">
                        If you don't have an account? <Link to="/signup" className="text-blue-500">Sign In</Link>
                    </p>
                </div>
            </div>
        </div>

    );
};

export default Login;