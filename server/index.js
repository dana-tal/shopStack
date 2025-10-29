const express = require('express');
const cors = require('cors');
const connectDB = require('./configs/db');

require('dotenv').config();  // load everything in .env file into process.env 

const app = express();

app.use( cors());
app.use(express.json());
const authRouter = require('./routers/authRouter');

const PORT = process.env.PORT || 3000;;

app.use('/auth', authRouter);
  
app.listen(PORT, ()=>{
   console.log(`Listening on port: ${PORT}`) ;
   connectDB();
   console.log('hello');
})