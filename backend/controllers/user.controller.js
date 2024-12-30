import  User  from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import generateToken from "../utils/generateToken.js";

export const signup = async (req, res)=>{

    const {name, email, password} = req.body;
    if(!email || !name || !password) return res.status(401).json({message:"All fields are required"});
    
    try {
        const userExists = await User.findOne({email});
        if(userExists) return res.status(401).json({message:"User already exists"});
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);
        const newUser = new User({name, email, password: hashedPassword});
        if(newUser){
            generateToken(newUser._id,res);
            await newUser.save();
            
            return res.status(201).json({message:"User created successfully",newUser});
        }else{
            return res.status(500).json({message:"Invalid user details"});
        }
    }catch(err){
        console.error("Error in SignUp"+err);
        return res.status(500).json({message:"Error while signing up"});
    }

};

export const login = async (req, res)=>{

    const {email, password} = req.body;
    if(!email ||!password) return res.status(401).json({message:"All fields are required"});
    
    try {
        const user = await User.findOne({email});
        if(!user) return res.status(401).json({message:"User not found"});
        const isMatch = await bcryptjs.compare(password, user.password);
        if(!isMatch) return res.status(401).json({message:"Invalid credentials"});
        generateToken(user._id,res);
        return res.json({message:"User logged in successfully",user});
    }catch(err){
        console.error("Error in Login"+err);
        return res.status(500).json({message:"Error while logging in"});
    }

};

export const logout = (req, res)=>{
    try{
        res.cookie("token", null, {expires: new Date(0)});
        return res.json({message:"User logged out successfully"});
    }catch(err){
        console.error("Error in Logout"+err);
        return res.status(500).json({message:"Error while logging out"});
    }

};