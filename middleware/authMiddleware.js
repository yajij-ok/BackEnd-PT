const User = require("../models/userModel");
const jwt = require ('jsonwebtoken')
const asyncHandler = require("express-async-handler");
const generateToken = require("../config/JWToken");


const authMiddleWareDummy = asyncHandler(async(req, res, next) =>{
    
    //if(req?.headers?.authorization?.startsWith("Bearer")){
   //var token = req.headers.authorization.split(" ")[1];
    
  const token = req.cookies.accessToken;
    

    try {
     if(token){
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({_id: decoded?.id});
        req.user = user;
        next();
        
     }else{
        throw new Error("No Token Found.");
        
     }
        
    } catch (error) {
        throw new Error("Not Authorized. Token expired");
        
    }
   //}else{
      //  throw new Error("No token found"); }
   });

   const authMiddleWare = asyncHandler(async(req, res, next) =>{
    
    if(req.headers.authorization.startsWith("PlayTech")){
   var token = req.headers.authorization.split(" ")[1]; 
    
  
    

    try {
     if(token){
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({_id: decoded?.id});
        req.user = user;
        next();
        
     }else{
        throw new Error("No Token Found.");
        
     }
        
    } catch (error) {
        throw new Error("Not Authorized. Token expired");
        
    }
   }else{
        throw new Error("No token found");
        
     }
   });

const isAdmin = asyncHandler(async(req,res, next)=>{
    const {email} = req.user;
    const adminUser = await User.findOne({ email });

    if(adminUser.role !== "admin"){
     throw new Error("You are not an admin.");
     
    }else{
        next();
    }
    
})

module.exports = {authMiddleWare, isAdmin }