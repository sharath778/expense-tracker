import React from 'react';
import { Link } from 'react-router-dom';

import landingImage from '../assets/images/landing.png';

const LandingPage = () => {
    return (
        <div className="relative h-screen bg-cover bg-center" style={{ backgroundImage: `url(${landingImage})` }}>
            <div className="flex items-center justify-center h-full bg-black bg-opacity-50">
                <div className="text-center text-white px-4 md:px-8 lg:px-16">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Welcome to Track your Expenses</h1>
                    <p className="text-base md:text-lg lg:text-xl mb-8">Get started with us today and explore amazing features.</p>
                    <Link to="/signup">
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded transition duration-300 ease-in-out">
                            Get Started
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;