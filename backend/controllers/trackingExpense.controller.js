import DailyExpense from "../models/dailyEpense.model.js";
import { MonthlyExpense } from "../models/monthlyExpense.model.js";
import { MonthlyIncome } from "../models/monthlyIncome.model.js";
import { YearlyExpense } from "../models/yearlyExpense.model.js";

export const addDailyEspense = async (req, res) => {
    try {
        const userId = req.user._id;
        if(!userId){
            return res.status(401).json({ msg: 'Not authorized' });
        }
        const currentDate = new Date();
        const month=currentDate.getMonth();
        const year = currentDate.getFullYear();
        const monthlyIncome = await MonthlyIncome.findOne({ month, year, userId});
        if(!monthlyIncome){
            return res.status(404).json({ msg: `No monthly income found-> Add ${month} income` });
        }

        const { amount, expenseType} = req.body;
        if(!amount||!expenseType){
            return res.status(400).json({ msg: 'Please provide amount and expenseType' });
        }
        
        const date = currentDate.getDate()+"-"+currentDate.getMonth()+"-"+currentDate.getFullYear();
        const time = currentDate.getHours()+":"+currentDate.getMinutes();
        var dailyExpense = await DailyExpense.findOne({
            userId,
            date
        });
        if(!dailyExpense){
            dailyExpense = new DailyExpense({
                userId,
                date,
                amount: [{ expenseType, amount, time}]
            });
        }else{
            dailyExpense.amount.push({ expenseType, amount, time});
        }
        dailyExpense.totalAmount=dailyExpense.totalAmount+amount;        await dailyExpense.save();
        monthlyIncome.remainingAmount=monthlyIncome.remainingAmount-amount;
        await monthlyIncome.save();
        res.json(dailyExpense);               

    }catch (e) {
        console.error("Error from addDailyEspense()"+e);
        return res.status(400).json({ msg: e.message });
    }
};

export const allDailyEspense = async (req, res)=>{
    try{
        const userId = req.user._id;
        if(!userId){
            return res.status(401).json({ msg: 'Not authorized' });
        }
        const {date} = req.body;
        if(!date){
            const currentDate = new Date();
            date =currentDate.getDate()+"-"+currentDate.getMonth()+"-"+currentDate.getFullYear();
        }
        const dailyExpenses = await DailyExpense.findOne({userId,date});
        
        if(!dailyExpenses){
            return res.status(404).json({ msg: 'No daily expenses found for this date' });
        }
        return res.json(dailyExpenses);
    }catch(e){
        console.error("Error from allDailyEspense()"+e);
        return res.status(500).json({ msg: 'Server Error' });
    }

};

export const updateDailyEspense =async (req, res)=>{
    try{
        const userId = req.user._id;
        if(!userId){
            return res.status(401).json({ msg: 'Not authorized' });
        }
        const {index, expenseType, amount} =req.body;
        if(!index|| (!expenseType&&!amount)){
            return res.status(400).json({ msg: 'Please provide (index) and date' });
        }
        const currDate = new Date();
        const date = currDate.getDate()+"-"+currDate.getMonth()+"-"+currDate.getFullYear();
        const dailyExpenses = await DailyExpense.findOne({userId, date});
        if(!dailyExpenses){
            return res.status(404).json({ msg: 'No daily expenses found for this date' });
        }
        if(expenseType){
            dailyExpenses.amount[index].expenseType = expenseType;
        }
        if(amount){
            const monthlyExpenses = await MonthlyIncome.findOne({month:currDate.getMonth(), year:currDate.getFullYear(), userId});
            if(!monthlyExpenses){
                return res.status(404).json({ msg: `No monthly income found-> Add ${month} income` });
            }
            const prevAmount = dailyExpenses.amount[index].amount;
            monthlyExpenses.remainingAmount=monthlyExpenses.remainingAmount+prevAmount-Number(amount);
            // console.log(monthlyExpenses);
            await monthlyExpenses.save();
            dailyExpenses.totalAmount=dailyExpenses.totalAmount-prevAmount+Number(amount);
            dailyExpenses.amount[index].amount = Number(amount);
        }
        dailyExpenses.amount[index].time = currDate.getHours()+":"+currDate.getMinutes();
        await dailyExpenses.save();
        return res.json(dailyExpenses);
    }catch(e){
        console.error("Error from updateDailyEspense()"+e);
        return res.status(500).json({ msg: 'Server Error' });
    }
};

export const deleteDailyEspense =async (req, res)=>{
    try{
        const userId = req.user._id;
        if (!userId) {
            return res.status(401).json({ msg: 'Not authorized' });
        }
        const {index}   = req.body;
        if(!index){
            return res.status(400).json({ msg: 'Please provide index' });
        }
        const currDate = new Date();
        const date = currDate.getDate()+"-"+currDate.getMonth()+"-"+currDate.getFullYear();
        const dailyExpenses = await DailyExpense.findOne({userId, date});
        if(!dailyExpenses){
            return res.status(404).json({ msg: 'No daily expenses found for this date' });
        }
        const monthlyExpenses = await MonthlyIncome.findOne({month:currDate.getMonth(), year:currDate.getFullYear(), userId});
        if(!monthlyExpenses){
            return res.status(404).json({ msg: `No monthly income found-> Add ${month} income` });
        }
        const prevAmount = dailyExpenses.amount[index].amount;
        monthlyExpenses.remainingAmount=monthlyExpenses.remainingAmount+prevAmount;
        // console.log(monthlyExpenses);
        await monthlyExpenses.save();
        dailyExpenses.totalAmount=dailyExpenses.totalAmount-prevAmount;
        dailyExpenses.amount.splice(index, 1);
        await dailyExpenses.save();
        return res.json(dailyExpenses);

    }catch(e){
        console.error("Error from deleteDailyEspense()"+e);
        return res.status(500).json({ msg: 'Server Error' });
    }
};

export const addMonthlyIncome = async (req, res)=>{
    try{

        const userId = req.user._id;
        if(!userId){
            return res.status(401).json({ msg: 'Not authorized' });
        }
        const currentDate = new Date();
        const month=currentDate.getMonth();
        const year = currentDate.getFullYear();
        const {income} = req.body;
        var monthlyIncome = await MonthlyIncome.findOne({month, year, userId});
        if(!monthlyIncome){
            monthlyIncome = new MonthlyIncome({
                income,
                month,
                year,
                userId,
                remainingAmount:income
            });
        }else{
            monthlyIncome.income=income;
            monthlyIncome.remainingAmount=income;
        }
        await monthlyIncome.save();
        res.json(monthlyIncome);
        if(!income){
            return res.status(400).json({ msg: 'Please provide income' });
        }

    }catch(e){
        console.error("Error from addMonthlyIncome()"+e);
        return res.status(400).json({ msg: e.message });
    }
};

export const getMonthlyIncome = async (req, res)=>{
    try{
        const userId = req.user._id;
        if(!userId){
            return res.status(401).json({ msg: 'Not authorized' });
        }
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const monthlyIncome = await MonthlyIncome.findOne({ month, year, userId});
        if(!monthlyIncome){
            return res.status(404).json({ msg: `No monthly income found for ${month} - ${year}` });
        }

        res.json(monthlyIncome);

    }catch(e){
        console.error("Error from getMonthlyIncome()"+e);
        return res.status(400).json({ msg: e.message });
    }
};

export const getMonthlyExpense = async (req, res)=>{
    try{
        const userId = req.user._id;
        if(!userId){
            return res.status(401).json({ msg: 'Not authorized' });
        }
        const {month, year}=req.body;
        if(!month||!year){
            return res.status(400).json({ msg: 'Please provide month and year' });
        }

        const monthlyIncome = await MonthlyIncome.findOne({ month, year, userId});
        if(!monthlyIncome){
            return res.status(404).json({ msg: `No monthly income found for ${month} - ${year}` });
        }
        const income = monthlyIncome.income;
        
        const monthlyExpense = await MonthlyExpense.findOne({userId, month, year});
        
        
        if(!monthlyExpense){
            var everyDay = [];
            var monthlyTotal =0;
            
            for(let i = 1; i < 32 ;i++){
                
                var x="";
                if(i<10){
                    x = "0"+i;
                }else{
                    x=i;
                }
                var date = x+"-"+month+"-"+year;
                
                const day = await DailyExpense.findOne({userId,date});   

                if(day){
                    
                    const dayData = {
                        date:day.date,
                        dayTotal: day.totalAmount                    
                    };
                    
                    monthlyTotal += day.totalAmount;
                    
                    everyDay.push(dayData);
                }else{
                    const dayData = {
                        date: `${i}-${month}-${year}`,
                        dayTotal: 0                    
                    };
                    
                    everyDay.push(dayData);
                }
                
            }
            const newMonthlyExpense = new MonthlyExpense({
                userId,
                month,
                year,
                incomeAmount: income,
                expenses: everyDay,
                monthlyTotal
            });
            await newMonthlyExpense.save();
            return res.status(201).json(newMonthlyExpense);
        }else{
            const monthlyExpense = await MonthlyExpense.findOneAndUpdate({ userId, month, year });
            monthlyExpense.monthlyTotal = 0;
            
            monthlyExpense.incomeAmount = income; 
            for (const day of monthlyExpense.expenses) {
                try {
                    const dailyExpense = await DailyExpense.findOne({ userId, date: day.date });
                    
                    if (dailyExpense) {
                        day.dayTotal = dailyExpense.totalAmount;  // Corrected typo (dayToatl -> dayTotal)
                        monthlyExpense.monthlyTotal += day.dayTotal;
                    }
                   
                } catch (error) {
                    console.error('Error fetching daily expense:', error);
                }
            }          
            await monthlyExpense.save();
            return res.status(201).json(monthlyExpense);
        }
        
    }catch(e){
        console.error("Error from getMonthlyExpense()"+e);
        return res.status(400).json({ msg: e.message });
    }

};

export const getYearlyExpense = async (req, res)=>{
    try{
        const userId = req.user._id;
        if(!userId){
            return res.status(401).json({ msg: 'Not authorized' });
        }
        const {year}=req.body;
        if(!year){
            return res.status(400).json({ msg: 'Please provide year' });
        }
        const yearlyExpense = await YearlyExpense.findOne({userId, year});
        if(!yearlyExpense) {
            let monthlyExpense = await MonthlyExpense.find({userId, year});
            if(!monthlyExpense){
                return res.status(404).json({ msg: `No yearly expense found for ${year}` });
            }
            monthlyExpense = monthlyExpense.sort((a,b)=>a.month-b.month);
            let monthlyData=[];
            let yearlyTotal = 0;
            let j=0;
            for(let i=0;i<12;i++){
                if (j <=i && i===monthlyExpense[i].month){
                    var month = {
                        month:i,
                        totalAmountSpent:monthlyExpense[i].monthlyTotal,
                        monthlyIncome: monthlyExpense[i].incomeAmount
                    }
                    monthlyData.push(month);
                    yearlyTotal += monthlyExpense[i].monthlyTotal;
                    j++;
                }else{
                    var month = {
                        month:i,
                        totalAmountSpent:0,
                        monthlyIncome:0
                    }
                    monthlyData.push(month);
                }
            }
            const newYearlyExpenses = new YearlyExpense({
                userId,
                year,
                totalAmountSpent:yearlyTotal,
                monthlyExpens:monthlyData
            });
            await newYearlyExpenses.save();
            return res.status(201).json(newYearlyExpenses);
        }else{
            const yearlyExpense = await YearlyExpense.findOneAndUpdate({ userId, year });
            let monthlyExpense = await MonthlyExpense.find({userId, year});
            monthlyExpense = monthlyExpense.sort((a, b) => a.month - b.month);
            let monthlyData = [];
            let yearlyTotal = 0;
            let j = 0;
            for (let i = 0; i < 12; i++) {
                if (j<=i && i === monthlyExpense[j].month) {
                    var month = {
                        month: i,
                        totalAmountSpent: monthlyExpense[j].monthlyTotal,
                        monthlyIncome: monthlyExpense[j].incomeAmount
                    }
                    monthlyData.push(month);
                    yearlyTotal += monthlyExpense[j].monthlyTotal;
                    j++;
                } else {
                    var month = {
                        month: i,
                        totalAmountSpent: 0,
                        monthlyIncome: 0
                    }
                    monthlyData.push(month);
                }
            }
            yearlyExpense.monthlyExpens=monthlyData;
            yearlyExpense.totalAmountSpent = yearlyTotal;
            await yearlyExpense.save();
            return res.status(201).json(yearlyExpense);
        }



    }catch(e){
        console.error("Error from getYearlyExpense()"+e);
        return res.status(400).json({ msg: e.message });
    }

};