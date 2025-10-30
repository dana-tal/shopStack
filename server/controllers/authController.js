const usersService = require('../services/usersService');


const registerUser = async (req,res) =>
{
    try
    {
     const firstName = req.body.firstName;
     const lastName  = req.body.lastName;
     const userName =  req.body.userName;
     const password = req.body.password;
     const permitOrdersExposure = req.body.permitOrdersExposure;

     // add validation ....

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