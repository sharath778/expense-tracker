import mongoose from 'mongoose';

const dailyExpenseShema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date:{
        type: String,
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
            },
            time:{
                type: String,
                required: true
            }
        }
    ],
    totalAmount: {
        type: Number,
        required: true,
        default: 0
    }
});

const DailyExpense = mongoose.model('DailyExpense', dailyExpenseShema);

export default DailyExpense;