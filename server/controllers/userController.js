const userService = require('../services/usersService');
const genValidator = require('../utils/generalValidator');
const userValidator = require('../utils/validateUser');

const getAllUsers = async (req,res) =>{

    try
    {    
        const allUsers = await userService.getAllUsers();
        return res.status(200).json({ ok:true, userData:allUsers,message:"All users read successfully"});
    }
    catch(err)
    {
        return res.status(500).json({
                    ok: false,
                    message: err.message                 
        });    
    }

}

const getUserById = async (req,res) => {
    try
    {
        
        const result = genValidator.validateMongoId('id',req.params.id);
        if (result)
        {
            return res.status(result.status).json({ok:false,userData:null,message:result.message});
        }
        const id = req.params.id;
        const user = await userService.getUserById(id);
         if (!user) 
        {
            return res.status(404).json({ok:false,usertData:null,message: `The user ${id} does not exist` });
        }
        return res.status(200).json({ok:true, userData:user,message:'User info returned successfully'}); 
    }
    catch(err)
    {
        return res.status(500).json({
                    ok: false,
                    message: err.message                 
        });    
    }
}

const updateUser = async ( req,res) =>
{
    try
    {
        userValidator.validateUserPayload(req.body, false,false); // if the validateUserPayload catches an error, it throws an exception
        const id = req.params.id;        
        const userObj = req.body;
        const updatedUser = await userService.updateUser(id,userObj);
        return res.status(200).json({ok:true, userData:updatedUser, message:'User updated successfully '});                         
    }
    catch(err)
    {
        console.log("Error");
        console.log( err);
        return res.status(err.status || 500).json({
            ok: false,
            message: err.message,
            errorField: err.field,           
         });  
    }
}



const deleteUsers = async (req,res) =>
{
    let result=null,i;
    try
    {
          const ids = req.body.ids;
          for (i=0; i<ids.length && result===null ;i++)
          {
              result = genValidator.validateMongoId('id',ids[i]);  
          }
          if (result)
          {
              return res.status(result.status).json({ok:false, userData:null, message:result.message});
          }

          const info = await userService.deleteUsers(ids);   
          return res.status(200).json({ ok:true, userData: info, message:'Users deleted successfully '});
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
    getAllUsers,
    getUserById,
    deleteUsers,
    updateUser
}