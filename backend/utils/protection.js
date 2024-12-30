import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const SECRET_KEY = process.env.SECRET_KEY ||"6c707a9c2dc2949987115052e5d28e0c82841adc4c0303a7b8eaf82f69bf9255";

const protection = async (req, res, next)=>{
    try{        
        const token = req.cookies.token;
        if(!token){
            return res.status(401).json({msg: 'No token, authorization denied'});
        }
        const decoded = jwt.verify(token,SECRET_KEY);
        // console.log(decoded);
        const user = await User.findById(decoded.userId).select('-password');
        if(!user){
            return res.status(401).json({msg: 'Token is not valid!'});
        }
        req.user = user;
        next();
    }catch(e){
        console.error("error in proteciton middleware", e);
        res.status(401).json({msg: 'Token is not valid'});
    }
};

export default protection;