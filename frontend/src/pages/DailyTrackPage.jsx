import React, { useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import { format } from 'date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { toast } from 'react-toastify';
import axios from 'axios';

// Registering chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const DailyTrackPage = () => {
    
    const [selectedDate, setSelectedDate] = useState(null);
    const [dailyData, setDailyData] = useState(null);
    const [loading, setLoading]=useState(false);
    // Handle the form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (selectedDate) {
            setLoading(true);
            const formattedDate = `${selectedDate.getDate()}-${selectedDate.getMonth()}-${selectedDate.getFullYear()}`;
            
            try{
                const response = await axios.post("/api/track/all-daily-espense",{date:formattedDate});
                
                if(response.data){
                    
                    setDailyData(response.data);
                }
            
            }catch(e){
                console.error(e);
                setDailyData(null);
                toast.error(e.response.data.msg);
            }finally{
                setLoading(false);
            }

        } else {
            alert("Please select month, year, and date");
        }
    };

    // Data for the graph
    const data = {
        labels: Array.from({ length: dailyData ? dailyData.amount.length : 10 }, (_, index) => index + 1), // Labels for x-axis (1 to 31)
        datasets: [
            {
                label: 'Daily Expenses',
                data: dailyData ? dailyData.amount.map(amt => amt.amount) : Array.from({ length: 10 }, () => Math.floor(Math.random() * 0)), // Random data for demonstration
                fill: false,
                borderColor: '#4CAF50', // Line color
                tension: 0.1, // Smoothness of the line
                pointBackgroundColor: '#4CAF50', // Point color
            },
        ],
    };

    // Options to configure the chart (scaling, axis, etc.)
    const options = {
        responsive: true,
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Days of the Month', // x-axis label
                },
                ticks: {
                    stepSize: 1, // Step size for each tick on x-axis (1 day increments)
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Expenses (₹)', // y-axis label
                },
                min: 0, // Start the scale from 0
                max: dailyData ? dailyData.totalAmount : 10000, // Maximum value on the y-axis
                ticks: {
                    stepSize: 1000, // Each tick increases by 100,000
                },
            },
        },
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            <Navbar />

            {/* Right section */}
            <div className='w-full relative z-10 mt-16 ml-28'>
                <div className="flex flex-col items-center py-6 px-4 sm:px-6 md:px-8 lg:px-12 z-10">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Daily Track</h2>

                    {/* Form for Month and Year Selection */}
                    <form onSubmit={handleSubmit} className="flex items-center space-x-4 mb-6">
                        <div className="flex-1">
                            <label htmlFor="date" className="block text-sm font-medium text-gray-700">Select Date</label>
                            <DatePicker
                                selected={selectedDate}
                                onChange={(date) => setSelectedDate(date)}
                                minDate={new Date('2024-01-01')} // Set minimum date to January 1st, 2024
                                maxDate={new Date()} // Set maximum date to the current date
                                dateFormat="dd/MM/yyyy"
                                placeholderText="Select a date"
                                className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                            />
                        </div>

                        <div>
                        { !loading ?   <button
                                type="submit"
                                className="mt-6 px-6 py-2 active:bg-blue-500 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                            >
                                Find
                            </button>:
                            <div
                                className="mt-6 px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                            >
                                loading...
                            </div>
                        }
                        </div>
                    </form>

                    {/* Line Graph */}
                    <div className="w-[75vw] mt-6 relative ml-24 h-[70vh]">
                        <Line data={data} options={options} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DailyTrackPage;
