const validator = require("validator");

function cleanUpAndValidate(username,email,password,name,phonenumber)
  {
    return new Promise((resolve,reject)=>{
        if(typeof email !== "string"){
            return reject("email is not a String");
        }
        if(!validator.isEmail(email)){
            return reject("invalid email format");
        }
        if(typeof username!=="string"){
            return reject("username is not a String");
        }
        if(typeof password!=="string"){
            return reject("password is not a String");
        }
        if(username.length < 3 || username.length > 30){
            return reject("the length of username should be 3-30 characters");
        }
        if(password && !validator.isAlphanumeric(password)){
            return reject("password should contain alphabet ad numbers");
        }
        return resolve();
    });
}

module.exports = cleanUpAndValidate;