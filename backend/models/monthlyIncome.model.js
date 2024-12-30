import mongoose from 'mongoose';

const monthlyIncomeSchema = new mongoose.Schema({
    income: {
        type: Number,
        required: true,
    },
    month: {
        type: Number,
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    remainingAmount:{
        type: Number,
        default: 0,
    }
});

export const MonthlyIncome = mongoose.model('MonthlyIncome', monthlyIncomeSchema);