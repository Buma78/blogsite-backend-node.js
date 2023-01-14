 const userSchema = require("../Schemas/User");
 const validator = require("validator");
 const bcrypt = require("bcrypt");
 const ObjectId = require("mongodb").ObjectId;

 let User = class{
       username;
       email;
       password;
       name;
       phonenumber;

       constructor({username,email,password,name,phonenumber}){
        this.username = username;
        this.email = email;
        this.password = password;
        this.name = name;
        this.phonenumber = phonenumber;
       }

       static verifyUsernameAndEmailExists({username,email}){
            return new Promise(async(resolve,reject)=>{
                try{
                 const userdb = await userSchema.findOne({
                    $or: [{username},{email}],
                 })

                 if(userdb && userdb.email === email){
                     return reject("Email already exists")
                 }
                 if(userdb && userdb.username === username){
                    return reject("username already taken");
                 }
                 return resolve();
                }
                catch(err){
                    reject(err);
                }
            })
       }

       registerUser(){
         return new Promise(async(resolve,reject)=>{
           const hashedpasssword = await bcrypt.hash(this.password,12);

              const user = new userSchema({
                 username: this.username,
                 email: this.email,
                 password: hashedpasssword,
                 name: this.name,
                 phonenumber: this.phonenumber
              })

              try{
                const userDb = await user.save();
                return resolve(userDb);
              }
              catch(err){
                  reject(err)
              }
        })
       }

       static loginUser({loginId,password}){
          return new Promise(async(resolve,reject)=>{
            let userDb = {};
              if(validator.isEmail(loginId)){
               userDb = await userSchema.findOne({email:loginId});
              }else{
               userDb = await userSchema.findOne({username:loginId});
              }

              if(!userDb){
                   return reject("no user found");
              }

              const ismatch = await bcrypt.compare(password,userDb.password);
              if(!ismatch){
                return reject({
                    status:400,
                    message: "password invalid"
                })
              }
              return resolve(userDb);
          })
       }

       static verifyUserId({ userId }) {
        return new Promise(async (resolve, reject) => {
          try {
            if (!ObjectId.isValid(userId)) {
              reject("Invalid userId");
            }
    
            const userDb = await userSchema.findOne({ _id: ObjectId(userId) });
            if (!userDb) {
              reject("No user found");
            }
    
            resolve(userDb);
          } catch (err) {
            reject(err);
          }
        });
      }
 }

 module.exports = User;