import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from "dotenv";
import path from 'path';
import connectDB from './db/connection.db.js';
import userAuth from './routers/user.route.js';
import tracking from './routers/trackExpense.route.js';

dotenv.config();

const __dirname = path.resolve();

const PORT = process.env.PORT||8000;
const app = express();

app.use(express.json());

app.use(cookieParser());

app.use('/api/users', userAuth);
app.use('/api/track',tracking);

app.use(express.static(path.join(__dirname, "/frontend/dist")));
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));  //path.join(__dirname,"/frontend/dist/index.html") is the path to your index.html file in dist folder.
})

app.listen(PORT,()=>{
    console.log(`server listening on ${PORT}!`);
    connectDB();
});