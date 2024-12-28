import mongoose from "mongoose";

const monthlyExpenseSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    month:{
        type: String,
        required: true
    },
    year:{
        type: Number,
        required: true
    },
    incomeAmount:{
        type: Number,
        required: true
    },
    expenses:[{
        date:{
            type: Date,
            required: true
        },
        dayTotal:{
            type: Number,
            required: true
        }
    }]
});

export const MonthlyExpense = mongoose.model("MonthlyExpense", monthlyExpenseSchema);