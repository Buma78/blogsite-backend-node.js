const express = require("express");
require('dotenv').config();
const clc = require("cli-color");
const mongoose = require("mongoose");
const session = require("express-session");
const mongoDBSession = require("connect-mongodb-session")(session);
const app = express();
const PORT = process.env.PORT || 8000;

const db = require("./Db");
const Authrouter = require("./Controllers/Auth");

app.use(express.json());
app.use(express.urlencoded({extended:true}));

const store= new mongoDBSession({
    uri : process.env.MONGODB,
    collection:"session",
});

app.use(
    session({
        secret: process.env.SECRET_KEY,
        resave: false,
        saveUninitialized: false,
        store: store
    })
)

app.get('/',(req,res)=>{
    res.send("welcome to blogg app");
})

app.use("/auth",Authrouter);

app.listen(PORT,()=>{
    console.log(clc.red("App is running on"));
    console.log(clc.yellow(`http://localhost:${PORT}`));
})