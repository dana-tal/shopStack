
const User = require('../models/userModel');


const addUser = (userObj)=>{
       const user = new User(userObj);
       return user.save();
}


const getUserByUsername = (username) =>{
     return User.findOne({userName:username})
}

const getAllUsers = ( filters={}) => {

     return User.aggregate([
    { $match: filters },
    {
      $project: {
        id: "$_id",
        _id: 0,       
        firstName: 1,
        lastName:1,
        userName:1,
        permitOrdersExposure:1,
        isAdmin:1,
        createdAt:1 
      }
    }
  ]);

}


const deleteUsers = (userIds) => {
  return User.deleteMany({ _id: { $in: userIds } });
};

/*
const getAllUsers = () =>{
    return User.find({}, '-password');
}*/

module.exports = {
    addUser,
    getUserByUsername,
    getAllUsers,
    deleteUsers
}