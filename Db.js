const clc = require("cli-color");
const mongoose = require("mongoose");

mongoose.set('strictQuery', true);

mongoose.connect(process.env.MONGODB,{
    useNewUrlParser:true,
    useunifiedTopology:true,
}).then((res)=>{
    console.log(clc.green("connected to mongodb successfully"));
}).catch((err)=>{
    console.log(clc.red("error in connecting to mongodb"));
})