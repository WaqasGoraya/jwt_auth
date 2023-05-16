const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name:{type:String, required:true, trim:true},
    email:{type:String, required:true, trim:true},
    password:{type:String, required:true, trim:true},
    tc:{type:Boolean, required:true}
},
{timestamps:true}
);

const userModel = mongoose.model('User',userSchema);

module.exports = userModel;