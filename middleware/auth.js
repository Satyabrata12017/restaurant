const jwt= require('jsonwebtoken');
const Register= require('../models/registers')


const auth= async(req,res,next)=>{
    try{
        const token= req.cookies.jwt;
        const verifyAdmin = jwt.verify(token,process.env.SECRET_KEY)
        console.log(verifyAdmin);

        const user=await Register.findOne({_id:verifyAdmin._id})
        console.log(user);

        req.token=token;
        req.user=user;
        next();
    }catch(error){
        res.status(404).redirect("/login")
    }
}

module.exports=auth;