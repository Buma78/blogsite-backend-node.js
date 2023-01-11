const express = require("express");
const Authrouter = express.Router();
const cleanUpAndValidate = require("../utils/AuthUtils");

Authrouter.post("/register",(req,res)=>{
    const{ email,username ,password} = req.body;
     console.log(req.body);
    cleanUpAndValidate(email,username,password).then(()=>{
        return res.send({
            status:200,
            messege:"successful"
        })
    }).catch((err)=>{
        return res.send({
        status:400,
        message:"invalid Data",
        error:err,
     })
    });
});

Authrouter.post("/login",(req,res)=>{
    console.log("login");
   return  res.send({
        status : 200,
    });
});

module.exports = Authrouter;