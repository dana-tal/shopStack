const usersRepo = require('../repositories/usersRepo');
const bcrypt = require('bcrypt');


const addUser = async (userObj) =>
{
    try
    {
        const newUser = await usersRepo.addUser(userObj);
        return ({ id: newUser._id, firstName: newUser.firstName, lastName: newUser.lastName, userName: newUser.userName,isAdmin: newUser.isAdmin, permitOrdersExposure: newUser.permitOrdersExposure});
    }
    catch(err)
    {
        console.log("addUser failed with :",err);  
        throw err;
    }

}

const verifyUser = async (username,password) =>{
     try
     {
        const user = await usersRepo.getUserByUsername(username);
        if (!user) 
        {
            return false;
        }
        const userData = { id: user._id ,firstName: user.firstName, lastName:user.lastName, userName: user.userName,isAdmin: user.isAdmin, permitOrdersExposure: user.permitOrdersExposure};
        
        const isMatching = await bcrypt.compare(password, user.password);
        if (isMatching)
        {
            return userData;
        }
        else
        {
            return false;
        }
         
     }
     catch(err)
     {
          console.log("verifyUser failed with :",err);  
           throw err;
     }


}

const userExists = async (username) =>{
    try
    {
        const user = await usersRepo.getUserByUsername(username);
        return user;
    }
    catch(err)
    {
        console.log("userExists failed with :",err);  
        throw err;
    }
}

const getAllUsers = async () =>{
    try
    {
        const users = await usersRepo.getAllUsers();
        return users;
    }
    catch(err)
    {
        console.log("getAllUsers failed with :",err);  
        throw err;
    }

}

module.exports = {
    addUser,
    verifyUser,
    userExists,
    getAllUsers
}
