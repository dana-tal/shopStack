
const User = require('../models/userModel');


const addUser = (userObj)=>{
       const user = new User(userObj);
       return user.save();
}


const getUserByUsername = (username) =>{
     return User.findOne({userName:username})
}

module.exports = {
    addUser,
    getUserByUsername
}