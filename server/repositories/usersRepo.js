
const User = require('../models/userModel');


const addUser = (userObj)=>{
       const user = new User(userObj);
       return user.save();
}


module.exports = {
    addUser
}