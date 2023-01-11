const express = require("express");
const Authrouter = express.Router();
const cleanUpAndValidate = require("../utils/AuthUtils");
const User = require("../Models/User");

Authrouter.post("/register",(req,res)=>{
    const{ username,email,password,name,phonenumber} = req.body;
    cleanUpAndValidate(username,email,password,name,phonenumber).then(async()=>{
       try{
        await User.verifyUsernameAndEmailExists({username,email});
       }
       catch(err){
          return res.send({
            status:401,
            message:"Error occured",
            error:err,
          })
       }
        
       const user = new User({
        username,
        email,
        password,
        name,
        phonenumber
       });
       
        try{
          const userdb = await user.registerUser();
          return res.send({
             status : 201,
             message: "Registrtaion successfull",
             data: userdb
          })
        }
        catch(err){
            return res.send({
                status: 401,
                message: "error occured",
                error : err
            })
        }
    }).catch((err)=>{
        return res.send({
        status:400,
        message:"invalid Data",
        error:err,
     })
    });
});



Authrouter.post("/login",async(req,res)=>{
   
       const {loginId,password} = req.body

      if(!loginId || !password){
        return res.send({
            status : 400,
            message: "missing credentials",
        })
      }

      try{
         const userDb = await User.loginUser({loginId,password});

             req.session.isAuth = true;
             req.session.user = {
                  userId: userDb._id,
                  name: userDb.name,
                  username:userDb.username,
                  email: userDb.email,
             }

            return res.send({
                status:200,
                message:"login successfull"
            })
         
      }catch(err){
        return res.send({
            status : 400,
            message: "please enter correct detail",
            error : err,
        })
      }
});

Authrouter.post("/logout",(req,res)=>{
    const userdata = req.session.user;
    console.log(userdata);
    req.session.destroy((err)=>{
         if(err){
            return res.send({
                status : 400,
                message: "logout unsuccessfull",
                error : err,
            })
         }

         return res.send({
            status : 200,
            message: "logout successfull",
            data : userdata,
        })
    })
})

module.exports = Authrouter;