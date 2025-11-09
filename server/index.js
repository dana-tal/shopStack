const express = require('express');
const cors = require('cors');
const connectDB = require('./configs/db');

require('dotenv').config();  // load everything in .env file into process.env 

const cookieParser = require("cookie-parser");

/*
cookie-parser is a middleware package for Express that:
- Reads cookies from the incoming HTTP request header (Cookie).
- Parses them into a nice JavaScript object.
- Puts that object on req.cookies.
*/

if (!process.env.JWT_SECRET) {
  throw new Error("Missing JWT_SECRET in environment");
}

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
app.use(cookieParser());

const authRouter = require('./routers/authRouter');

const PORT = process.env.PORT || 3000;;

app.use('/auth', authRouter);
  
app.get("/", (req, res) => {
  res.send("Server is running! ");
});

app.listen(PORT, ()=>{
   console.log(`Listening on port: ${PORT}`) ;
   connectDB();
   
})