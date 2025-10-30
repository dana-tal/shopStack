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
        if (!user) 
        {
            throw new Error(`User with username: ${username} does not exist`);
        }
        const isMatching = await bcrypt.compare(password, user.password);
        return isMatching; 
     }
     catch(err)
     {
          console.log("verifyUser failed with :",err);  
           throw err;
     }


}

module.exports = {
    addUser,
    verifyUser
}
