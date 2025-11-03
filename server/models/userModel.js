const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const userSchema = new mongoose.Schema({
    firstName :{ type:String, required:true},
    lastName: { type:String, required:true},
    userName: { type:String, required:true,unique: true},
    password: { type:String, required:true},
    permitOrdersExposure: { type:Boolean, required:true},
    isAdmin: { type:Boolean, default: false  }
},
{
     versionKey: false,
     timestamps:true
});

// This runs before saving a user
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // only hash if password is new or changed , this line eliminates double hashing 
                                                    // this → refers to the current user document being saved.
  try {
    const salt = await bcrypt.genSalt(10); // generate a salt , salt is concatenated to the password before hashing. So even if two users chose the same password
                                           // they would be saved differently in the database 
    this.password = await bcrypt.hash(this.password, salt); // hash password
    next();   // everything O.K, continue to the actual save , or another pre-save middleware 
  } catch (err) {
    next(err);  // stops save and propagates the error to the calling code
  }
});


const userModel = mongoose.model('user',userSchema);


module.exports = userModel;