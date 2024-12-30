import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from "dotenv";
import connectDB from './db/connection.db.js';
import userAuth from './routers/user.route.js';
import tracking from './routers/trackExpense.route.js';

dotenv.config();

const PORT = process.env.PORT||8000;
const app = express();

app.use(express.json());

app.use(cookieParser());

app.use('/api/users', userAuth);
app.use('/api/track',tracking);

app.listen(PORT,()=>{
    console.log(`server listening on ${PORT}!`);
    connectDB();
});