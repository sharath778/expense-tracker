import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';  // If you want to show notifications
import { useNavigate } from 'react-router-dom';

const MonthlyIncomeForm = () => {
    const [income, setIncome] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        setIncome(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate input
        if (!income || isNaN(income) || income <= 0) {
            toast.error("Please provide a valid income amount.");
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post('/api/track/add-monthly-income', { income });

            if (response.data) {
                toast.success("Income added successfully!");
                navigate("/dashboard");
                // Optionally reset the form
                setIncome('');
            }
        } catch (error) {
            console.error("Error adding income:", error);
            toast.error("An error occurred while adding income.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md mt-8">
            <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Add Monthly Income</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="income" className="block text-sm font-medium text-gray-700">Monthly Income</label>
                    <input
                        type="number"
                        id="income"
                        name="income"
                        value={income}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                    />
                </div>

                {loading ? (
                    <button
                        type="button"
                        className="w-full bg-blue-500 text-white font-bold py-2 rounded cursor-not-allowed opacity-50"
                    >
                        Submitting...
                    </button>
                ) : (
                    <button
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 rounded transition duration-300 ease-in-out"
                    >
                        Add Income
                    </button>
                )}
            </form>
        </div>
    );
};

export default MonthlyIncomeForm;
