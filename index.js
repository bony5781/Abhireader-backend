require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const authRoute = require('./routes/authRoute');
/* 
* MongoDB connection 
* When strict option is set to true , Mongoose will ensure that
* only the fields that are specified in your Schema will be saved
* in the database, and all other fields will not be saved
* (if some other fields are sent).
*/
mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("Connection to Mongodb successfull"))
    .catch(err => console.log(err));

//Middlewares and Routes
app.use(express.json());
app.use("/api/auth", authRoute);
app.use((err, req, res, next) => {
    console.log("Shit");
})

app.get("/", (req, res) => {
    res.send("Hello");
})

app.listen(5000, () => {
    console.log("Listening on port 5000");
})