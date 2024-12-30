import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.SECRET_KEY ||"6c707a9c2dc2949987115052e5d28e0c82841adc4c0303a7b8eaf82f69bf9255";

const generateToken = (userId, res)=>{
    const token = jwt.sign({userId}, SECRET_KEY, { expiresIn: '1h'});

    res.cookie("token", token,{
        expires: new Date(Date.now() + 3600000),
        httpOnly: true,
        secure: false
    });
}
export default generateToken;