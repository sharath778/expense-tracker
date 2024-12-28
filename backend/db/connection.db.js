import mongoose from 'mongoose';

const link = "mongodb+srv://expense:5qrB8FgJuJ8Ep4Mm@cluster0.sdwfs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const connectDB = async ()=>{
    try{
        await mongoose.connect(link);
        console.log("MongoDB Connected successfully!");
    }catch(e){
        console.error("error in mongodb connection: "+e);
        process.exit(1);
    }
};

export default connectDB;