import { Router } from "express";
import protection from "../utils/protection.js";
import { addDailyEspense, 
    allDailyEspense, 
    updateDailyEspense, 
    deleteDailyEspense, 
    addMonthlyIncome, 
    getMonthlyIncome, 
    getMonthlyExpense, 
    getYearlyExpense } from "../controllers/trackingExpense.controller.js";

const router = Router();

router.post("/add-daily-espense", protection, addDailyEspense);
router.post("/all-daily-espense", protection, allDailyEspense);
router.patch("/update-daily-espense", protection, updateDailyEspense);
router.delete("/delete-daily-espense", protection, deleteDailyEspense);
router.post("/add-monthly-income", protection, addMonthlyIncome);
router.get("/get-monthly-income", protection, getMonthlyIncome);
router.post("/get-monthly-expense", protection, getMonthlyExpense);
router.post("/get-yearly-expense", protection, getYearlyExpense);

export default router;