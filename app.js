const express = require('express')
const app = express();
const db = require('./config/db');
const morgan = require("morgan");
const bodyParser = require("body-parser");
require('dotenv').config();

//Import Routes using destructure way
const  userRoutes = require("./routes/userRoutes");
const  candidateRoutes = require("./routes/candidateRoutes");

//MiddleWare
app.use(morgan('dev'));
app.use(bodyParser.json());


//Use the routes
app.use("/api/user", userRoutes);
app.use("/api/candidate", candidateRoutes);

//connect to Mongodb 
const port = process.env.PORT || 8080;
app.listen(port, () =>{
console.log(`Server is running on port: ${port} `)
});