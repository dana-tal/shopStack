
const User = require('../models/userModel');
const Order = require('../models/orderModel');


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



const getUserById = (id) =>
{
    return User.findById(id).lean(); // lean makes the returned object json like and faster to retrieve and use (no mongoose overhead)
}


const deleteUsers = (userIds) => {
  return User.deleteMany({ _id: { $in: userIds } });
};


const updateUser = async (id, userObj) =>
{
   const user = await User.findById(id);
   user.firstName = userObj.firstName;
   user.lastName = userObj.lastName; 
   user.userName = userObj.userName;
   user.permitOrdersExposure = userObj.permitOrdersExposure; 
   if (userObj.password) // if password was supplied ...
   {
     user.password = userObj.password;
   }
   return await user.save();                                                                         
}

const getBuyers = () =>{

    return Order.aggregate([
    // 1. Group orders by userId (this guarantees uniqueness)
    {
      $group: {
        _id: "$userId"
      }
    },

    // 2. Join with users collection
    {
      $lookup: {
        from: "users",            // MongoDB collection name (plural!)
        localField: "_id",  // the grouped _id
        foreignField: "_id",
        as: "user"
      }
    },

    // 3. Flatten the joined user array
    { $unwind: "$user" },

    // 4. Shape the response
    {
      $project: {
        _id: 0,
        userId: "$user._id",
        firstName: "$user.firstName",
        lastName: "$user.lastName"
      }
    }
  ]);

}

module.exports = {
    addUser,
    getUserByUsername,
    getUserById,
    getAllUsers,
    deleteUsers,
    updateUser, 
    getBuyers
}