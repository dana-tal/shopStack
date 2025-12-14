const userService = require('../services/usersService');

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

module.exports = {
    getAllUsers
}