import React, { useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { toast } from 'react-toastify';
import axios from 'axios';

// Registering chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const YearlyTrackPage = () => {
    
    const [selectedYear, setSelectedYear] = useState('');
    const [yearData, setYearData]=useState(null);
    const [loading, setLoading] = useState(false);

    // Handle the form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (selectedYear) {
            setLoading(true);
            try{
                
                const response = await axios.post("/api/track/get-yearly-expense",{year:selectedYear});
                if(response.data){
                    
                    setYearData(response.data);  
                                   
                }
            }catch(e){
                console.log(e);
                toast.error(e.response.data.msg);
            }finally{
                setLoading(false);
            }
        } else {
            alert("Please select both month and year");
        }
    };

    // Data for the graph
    const data = {
        labels: Array.from({ length: 12 }, (_, index) => index + 1), // Labels for x-axis (1 to 31)
        datasets: [
            {
                label: 'Daily Income',
                data: yearData ? yearData.monthlyExpens.map(x => x.totalAmountSpent) : Array.from({ length: 12 }, (_, index) => index*0), // Random data for demonstration
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
                    text: 'Months of Year', // x-axis label
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
                max: yearData ? yearData.totalAmountSpent*10 : 650000, // Maximum value on the y-axis
                ticks: {
                    stepSize: 10000, // Each tick increases by 100,000
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
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Yearly Track</h2>

                    {/* Form for Month and Year Selection */}
                    <form onSubmit={handleSubmit} className="flex items-center space-x-4 mb-6">
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

export default YearlyTrackPage;
