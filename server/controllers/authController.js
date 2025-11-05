const usersService = require('../services/usersService');
const validator = require('../utils/validator');

const registerUser = async (req,res) =>
{
    try
    {
     let result;
     const names = ['firstName','lastName'];

   //  const permitOrdersExposure = req.body.permitOrdersExposure;

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
        

        const newUser = await usersService.addUser({ firstName,lastName,userName,password, permitOrdersExposure });
        return res.status(201).json(newUser);
    }
    catch(err)
    {
         return res.status(500).json({
                ok: false,
                message: err.message || err,
                error: err.message || err
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
        if ( userData)
        {
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
                message: err.message || err,
                error: err.message || err
            });   
    }
}

module.exports = {
    registerUser,
    loginUser
}