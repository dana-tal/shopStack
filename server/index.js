const express = require('express');
const cors = require('cors');
const connectDB = require('./configs/db');

require('dotenv').config();  // load everything in .env file into process.env 

const app = express();



// List of allowed origins
const allowedOrigins = [
  process.env.PRODUCTION_CLIENT,
  process.env.DEV_CLIENT
].map(url => url.replace(/\/$/, "")); // remove trailing slash

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like Postman or curl)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));


app.use(express.json());
const authRouter = require('./routers/authRouter');

const PORT = process.env.PORT || 3000;;

app.use('/auth', authRouter);
  
app.listen(PORT, ()=>{
   console.log(`Listening on port: ${PORT}`) ;
   connectDB();
   
})