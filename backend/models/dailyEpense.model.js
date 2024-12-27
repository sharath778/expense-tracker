import mongoose from 'mongoose';

const dailyExpenseShema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date:{
        type: Date,
        required: true
    },
    amount:[
        {
            expenseType: {
                type: String,
                required: true
            },
            amount: {
                type: Number,
                required: true
            }
        }
    ]
});

export const DailyExpense = mongoose.model('DailyExpense', dailyExpenseShema);