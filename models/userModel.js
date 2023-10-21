const mongoose = require('mongoose')

//schema Design
const userSchema = new mongoose.Schema({

    name:{
        type:String,
        require:[true,'name is required']

    },
    email:{
        type:String,
        required:[true,'Email is required and should be unique'],
        unique:true

    },
    password:{
        type:String,
        require:[true,"Password is required"]

    },
},
{ timestamps:true }
);

//export
const userModel = mongoose.model('user',userSchema)
module.exports = userModel