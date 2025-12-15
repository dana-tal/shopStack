const userService = require('../services/usersService');
const genValidator = require('../utils/generalValidator');

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
    deleteUsers
}