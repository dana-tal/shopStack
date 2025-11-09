const usersService = require('../services/usersService');
const validator = require('../utils/validator');

require('dotenv').config();  // load everything in .env file into process.env 
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;



const registerUser = async (req,res) =>
{
    try
    {
     let result;
     const names = ['firstName','lastName'];

     for (const name of names) 
     {
        result = validator.validatePersonName(req.body[name], name);
        if (result) 
        {
            return res.status(result.status).json({ok:false, errorField:name, message: result.message});
        }
    }
    result = await validator.validateUsername(req.body.userName);
    if (result)
    {
        return res.status(result.status).json({ok:false, errorField:'userName', message: result.message});
    }
    result = validator.validateUserPassword(req.body.password, req.body.userName);
    if (result)
    {
        return res.status(result.status).json({ok:false, errorField:'password', message: result.message}); 
    }

    if (typeof req.body.permitOrdersExposure !== 'boolean') 
    {
       return res.status(400).json({ok:false, errorField:'permitOrdersExposure',messsage:"permitOrdersExposure must be a boolean (true/false)"});
    }

    const { firstName, lastName,userName, password ,permitOrdersExposure} = req.body;
        

      // await usersService.addUser({ firstName,lastName,userName,password, permitOrdersExposure });
       const newUser = await usersService.addUser({ firstName, lastName, userName, password, permitOrdersExposure });

        const token = jwt.sign(newUser, JWT_SECRET, { expiresIn: "1h" });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 60 * 60 * 1000
            });

        return res.status(201).json({ ok:true, userData: newUser, message: "Registration successful" });
        //return res.status(201).json({firstName, lastName, userName,  permitOrdersExposure });
    }
    catch(err)
    {
         return res.status(500).json({
                ok: false,
                message: err.message                 
            });      
    }
}

const loginUser = async (req,res) =>{
    try
    {
        let { userName, password } = req.body;

        userName = userName?.trim();
        password = password?.trim();

        if (!userName || typeof userName !== 'string' || userName.length < 3)  
        {
            return res.status(400).json({ok:false, errorField:'userName', message: 'userName is a required string field and must have at least 3 characters'});
        }
    
        if (!password || typeof password !== 'string' || password.length <6)
        {
            return res.status(400).json({ok:false, errorField:'password', message: 'password is a required string field and must have at least 6 characters'}); 
        }
   
        const userData = await usersService.verifyUser(userName,password);
        if ( userData) // everything is O.K , the user is verified ...
        {
             
             // create a token 
             const token = jwt.sign(
                    userData,
                    JWT_SECRET,
                    { expiresIn: "1h" }
                );    

            res.cookie("token", token, {
                httpOnly: true,   /* Cookie cannot be read by JavaScript in the browser. Protects against XSS attacks. */ 
                secure: process.env.NODE_ENV === "production", // only require HTTPS in production. Protects against sniffing. In dev, the cookie works over http. 
                sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // "none" for production (cross-origin), "lax" for development (simpler testing)
                maxAge: 60 * 60 * 1000
            });

             return res.json({ ok:true,userData, message: "Login successful" , status:"O.K" });
        }
        else
        {
             return res.status(401).json({ ok:false, message: "Login failed, wrong credentials" , status:"Error" });
        }
    }
    catch(err)
    {
          return res.status(500).json({
                ok: false,
                message: err.message                 
            });   
    }
}

module.exports = {
    registerUser,
    loginUser
}