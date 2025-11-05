const usersRepo = require('../repositories/usersRepo');
const bcrypt = require('bcrypt');


const addUser = (userObj) =>
{
    return usersRepo.addUser(userObj);
}

const verifyUser = async (username,password) =>{
     try
     {
        const user = await usersRepo.getUserByUsername(username);
        console.log("user:");
        console.log(user);

        if (!user) 
        {
            throw new Error(`User with username: ${username} does not exist`);
        }
        const userData = { firstName: user.firstName, lastName:user.lastName, userName: user.userName,isAdmin: user.isAdmin, permitOrdersExposure: user.permitOrdersExposure};
        
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

module.exports = {
    addUser,
    verifyUser,
    userExists
}
