import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

import loginImage from "../assets/images/authImage.png";
import { toast } from 'react-toastify';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Handle form submission logic here
        if(!formData.name || !formData.email || !formData.password || !formData.confirmPassword){
           
            toast.error("Fill all fields!");
            return;
        }
        if(formData.password!==formData.confirmPassword){
            
            toast.error("Passwords do not match!")
            return;
        }
        setLoading(true);
        try{
            
            const response = await axios.post("/api/users/signup",{name:formData.name, email:formData.email,password:formData.password});
            if(response.data.newUser){
                toast.success("User created successfully!");
                localStorage.setItem("user", JSON.stringify({ name:response.data.newUser.name, id:response.data.newUser._id}));
                navigate("/dashboard");
            }

        }catch(e){
            console.error("Error in SignUp",e);
        }finally{
            setLoading(false);
        }
        return;
        
    };

    return (
        <div className="relative h-screen bg-cover bg-center" style={{ backgroundImage: `url(${loginImage})` }}>
            {/* Semi-transparent overlay */}
            <div className="absolute inset-0 bg-black opacity-40 z-0"></div>

            <div className="flex items-center justify-center min-h-screen z-10 relative">
                <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                    <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                            />
                        </div>
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
                        <div className="mb-4">
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
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                                />
                                <span
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>
                        </div>
                        {loading ? <div
                            className="w-full text-center bg-blue-500 text-white font-bold py-2 rounded transition duration-300 ease-in-out"
                        >
                            Signing Up...
                        </div>:
                            <button
                            type="submit"
                                className="w-full bg-blue-500 hover:bg-blue-700 active:bg-blue-500 text-white font-bold py-2 rounded transition duration-300 ease-in-out"
                        >
                            Sign Up
                        </button>}
                    </form>
                    <p className="mt-6 text-sm text-center text-gray-600">
                        Already have an account? <Link to="/login" className="text-blue-500">Log In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
