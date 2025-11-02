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
         return res.status(500).json(err);      
    }
}

const loginUser = async (req,res) =>{
    try
    {
        const userName =  req.body.userName;
        const password = req.body.password;
        const isVerified = await usersService.verifyUser(userName,password);
        if ( isVerified)
        {
             res.json({ message: "Login successful" , status:"O.K" });
        }
        else
        {
              res.json({ message: "Login failed" , status:"Error" });
        }

    }
    catch(err)
    {
          return res.status(500).json(err);   
    }
}


module.exports = {
    registerUser,
    loginUser
}