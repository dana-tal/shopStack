const usersRepo = require('../repositories/usersRepo');
const bcrypt = require('bcrypt');


const addUser = async (userObj) =>
{
    try
    {
        const newUser = await usersRepo.addUser(userObj);

        const user = newUser.toObject(); 
        delete user.password;
        user.id = user._id;
        delete user._id;
        delete user.__v;
        return (user);
    }
    catch(err)
    {
        console.log("addUser failed with :",err);  
        throw err;
    }

}

const updateUser = async (id, userObj) =>
{
    try
    {
        if (userObj.password === "" || userObj.password == null) // password is optional and may be empty. Removing the password field prevents updating it to empty value.
        {
            delete userObj.password;
        }
        const updatedUser = await usersRepo.updateUser(id,userObj);
        const user =updatedUser.toObject(); 
        delete user.password;
        user.id = user._id;
        delete user._id;
        delete user.__v;

        return (user); 
    }
    catch(err)
    {
         console.log("updateUser failed with :",err);  
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

const getUserById = async (id) => {

    try
    {
        const user = await usersRepo.getUserById(id);
         if (!user) return null;
        user.id = user._id;
        delete user._id;
        delete user.password;
        return user;
    }
    catch(err)
    {
        console.log("getUserByID failed with :",err);  
        throw err;
    }

}


const deleteUsers = (ids) =>
{
    return usersRepo.deleteUsers(ids);
}


module.exports = {
    addUser,
    updateUser,
    verifyUser,
    userExists,
    getAllUsers,
    getUserById,
    deleteUsers
}
