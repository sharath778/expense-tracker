import express from 'express';
import cookieParser from 'cookie-parser';

const app = express();

app.use(express.json());

app.use(cookieParser());

app.listen(8000,()=>{
console.log("server listening on 8000!");
});