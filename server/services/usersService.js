const usersRepo = require('../repositories/usersRepo');


const addUser = (userObj) =>
{
    return usersRepo.addUser(userObj);
}


module.exports = {
    addUser
}
