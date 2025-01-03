import React, { useEffect, useState } from 'react';
import { FaTrashAlt, FaPen } from 'react-icons/fa';

import Navbar from '../components/Navbar.jsx';
import axios from 'axios';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
  });

  const [entries, setEntries] = useState([]);
  const [editingEntry, setEditingEntry] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dataIndex, setIndex] = useState(0);
  

  // Handle form input changes
  const getEntries = async ()=>{
    try{
      const response = await axios.post("/api/track/all-daily-espense",{});
      if(response){
        setEntries(response.data.amount);
        localStorage.setItem("daytotal",response.data.totalAmount);
      }
    }catch(e){
      console.error(e);
      console.log('An error occurred while fetching your entries.');
    }
  }
  useEffect(()=>{
    getEntries();
  },[]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingEntry) {
      try{  
        // console.log(index);
        const response = await axios.patch("/api/track/update-daily-espense", {index:dataIndex, amount: formData.amount, expenseType: formData.category});
        if(response){
          toast.success("Entry updated successfully!");
          getEntries();
          setFormData({ category: '', amount: '' });
          setEditingEntry(false);
          setIndex(0);
          return;
        }

      }catch(e){
        toast.error("An error occurred while updating your entry.");
        setEditingEntry(false);
        return;
      }
      return;
    }

    setLoading(true);
    try{
      const response = await axios.post("/api/track/add-daily-espense", { amount: formData.amount, expenseType: formData.category});
      if(response){
        
        toast.success("Entry added successfully!");
        getEntries();
        setFormData({ category: '', amount: '' });
      }
    }catch(e){
      console.error(e);
      alert('An error occurred while saving your entry.');
    }finally{
      setLoading(false);
    }
    // Reset form data
  };

  // Handle entry deletion
  const handleDelete = async(ind) => {
    
    try{
      const response = await axios.delete("/api/track/delete-daily-espense/",{
        params: { index: ind }
      });
      if(response){
        toast.success("Entry deleted successfully!");
        getEntries();
      }
    }catch(e){
      console.error(e);
      toast.error(e.response.data.msg);
    }    

  };

  // Handle edit click
  const handleEdit = async (ind) => {
    setEditingEntry(true);
    setIndex(ind);
    setFormData({ category: entries[ind].expenseType, amount: entries[ind].amount });
  };

  // Get formatted date
  const formattedDate = new Date().toLocaleDateString();

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />

      {/* Right section */}
      <div className='w-full relative z-10 mt-28 ml-28'>
        <div className="flex flex-col items-center py-6 px-4 sm:px-6 md:px-8 lg:px-12 z-10">
          {/* Form */}
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-xl mb-6">
            <h2 className="text-xl font-bold mb-4 text-center">{editingEntry ? 'Edit Entry' : 'Add Entry'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Amount</label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 rounded transition duration-300 ease-in-out"
              >
                {editingEntry ? 'Update Entry' : 'Add Entry'}
              </button>
            </form>
          </div>

          {/* Entries List */}
          <div className="w-full max-w-xl">
            {entries.length > 0 ? (
              <div>
                <h3 className="text-lg font-semibold mb-4">Entries</h3>
                <div className="max-h-80 overflow-y-auto">
                  {entries.map((entry, index) => (
                    <div key={entry._id}  className="bg-white p-4 mb-4 rounded-lg shadow-md flex flex-col sm:flex-row justify-between items-center">
                      <div className="text-sm text-gray-700 mb-4 sm:mb-0">
                        <p><strong>Category:</strong> {entry.expenseType}</p>
                        <p><strong>Amount: &#8377;</strong>  {entry.amount}</p>
                        <p className='text-gray-500 text-sm'> {entry.time}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          className="text-blue-500 hover:text-blue-700 mx-2"
                          onClick={() => handleEdit(index)}
                        >
                          <FaPen />
                        </button>
                        <button
                          className="text-red-500 hover:text-red-700 mx-2"
                          onClick={() => handleDelete(index)}
                        >
                          <FaTrashAlt />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-center text-gray-500">No entries found.</p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
