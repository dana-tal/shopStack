const mongoose = require('mongoose');

const connectDB = () =>{

    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/shopStack';

  
    mongoose.connect(mongoURI,{
        serverSelectionTimeoutMS: 3000  // fail fast after 3 seconds
        })
    .then( async ()=>{
        console.log("Successfully connected to shopStack database");
        
    })
    .catch( err=> {
        console.log(err);
      }
    )
}

module.exports = connectDB;