import express from 'express';
import cookieParser from 'cookie-parser';
import connectDB from './db/connection.db.js';

const app = express();

app.use(express.json());

app.use(cookieParser());

app.listen(8000,()=>{
    console.log("server listening on 8000!");
    connectDB();
});