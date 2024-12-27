import mongoose from 'mongoose';

const yearlyExpenseSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
    totalAmountSpent: {
        type: Number,
        required: true,
    },
    monthlyEexpens: [
        {
            month:{
                type: Number,
                required: true,
            },
            totalAmountSpent: {
                type: Number,
                required: true,
            }
        },
    ],
});

export const YearlyExpense = mongoose.model('YearlyExpense', yearlyExpenseSchema);