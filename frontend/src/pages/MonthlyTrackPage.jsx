import React, { useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import { toast } from 'react-toastify';

// Registering chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const MonthlyTrackPage = () => {
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [monthData, setMonthData] = useState(null);
    const [loading, setLoading] = useState(false);

    // Handle the form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (selectedMonth && selectedYear) {
            try{
                const response = await axios.post("/api/track/get-monthly-expense",{month:Number(selectedMonth),year:Number(selectedYear)});
                
                if(response){
                    setMonthData(response.data);
                }
            }catch(e){
                toast.error("Their is no data for this date!");
                setMonthData(null);
                console.error("Error fetching data: ", e);

            }finally{
                setLoading(false);
            }
        } else {
            alert("Please select both month and year");
        }
    };

    // Data for the graph
    const data = {
        labels: Array.from({ length: 31 }, (_, index) => index + 1), // Labels for x-axis (1 to 31)
        datasets: [
            {
                label: 'Daily Income',
                data: monthData!==null  ? monthData.expenses.map(expense => expense.dayTotal) : Array.from({ length: 31 }, () => Math.floor(Math.random() * 0)), // Random data for demonstration
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
                    text: 'Income (₹)', // y-axis label
                },
                min: 0, // Start the scale from 0
                max: monthData !== null ? Math.min(monthData.incomeAmount, monthData.monthlyTotal)+1000:650000, // Maximum value on the y-axis
                ticks: {
                    stepSize:1000, // Each tick increases by 100,000
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
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Monthly Track</h2>

                    {/* Form for Month and Year Selection */}
                    <form onSubmit={handleSubmit} className="flex items-center space-x-4 mb-6">
                        <div className="flex-1">
                            <label htmlFor="month" className="block text-sm font-medium text-gray-700">Select Month</label>
                            <select
                                id="month"
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(e.target.value)}
                                className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                            >
                                <option value="">Choose Month</option>
                                <option value="0">January</option>
                                <option value="1">February</option>
                                <option value="2">March</option>
                                <option value="3">April</option>
                                <option value="4">May</option>
                                <option value="5">June</option>
                                <option value="6">July</option>
                                <option value="7">August</option>
                                <option value="8">September</option>
                                <option value="9">October</option>
                                <option value="10">November</option>
                                <option value="11">December</option>
                            </select>
                        </div>

                        <div className="flex-1">
                            <label htmlFor="year" className="block text-sm font-medium text-gray-700">Select Year</label>
                            <select
                                id="year"
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(e.target.value)}
                                className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                            >
                                <option value="">Choose Year</option>
                                {[2020, 2021, 2022, 2023, 2024, 2025].map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            {!loading ? <button
                                type="submit"
                                className="mt-6 px-6 py-2 active:bg-blue-500 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                            >
                                Find
                            </button> :
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

export default MonthlyTrackPage;
