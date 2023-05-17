const userModel = require('../../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const transporter = require('../../../config/emailConfig');

class userController {
            static userRegister = async (req,res) => {
                    const {name,email,password,password_confirm,tc} = req.body;
                    const user = await userModel.findOne({email:email});
                    if(user){
                        res.send({"status":"failed","message":"Email already exist"});
                    }else{
                        if(name && email && password && password_confirm && tc){
                            if(password === password_confirm){
                                  try {
                                    const hashPassword = await bcrypt.hash(password,12);
                                    const userDoc = new userModel({
                                        name:name,
                                        email:email,
                                        password:hashPassword,
                                        tc:tc
                                    });
                                    await userDoc.save();
                                    const save_user = await userModel.findOne({email:email});
                                    const token = jwt.sign({userId:save_user._id},process.env.JWT_SECCRET,{expiresIn:'5d'});
                                    res.send({"status":"success","message":"User registerd successfully!","token":token});
                            } catch (error) {
                                console.log(error);
                                res.send({"status":"failed","message":"Unable to register user!"});
                            }
                            }else{
                                res.send({"status":"failed","message":"password and confirm password not does match!"});
                            }
                          
                        }else{
                            res.send({"status":"failed","message":"All fields are required"});
                        }
                    }

            }
            static userLogin = async (req,res) => {
                try {
                   const {email,password} = req.body;
                        if(email && password){
                            const user = await userModel.findOne({email:email});
                            if(user){
                                const isMatch = await bcrypt.compare(password,user.password);
                                if(email == user.email && isMatch){
                                    const token = jwt.sign({userId:user._id},process.env.JWT_SECCRET,{expiresIn:'5d'});
                                    res.send({"status":"success","message":"User LoggedIn Success!","token":token});
                                }else{
                                    res.send({"status":"failed","message":"Email or password does'nt match!"});
                                }
                            }else{
                                res.send({"status":"failed","message":"Invalid email or password!"});
                            }
                        }
                        else{
                            res.send({"status":"failed","message":"All fields are required"});
                        }
                    } catch (error) {
                        console.log(error);
                        res.send({"status":"failed","message":"Unable to Login"});
                    }
            }
            static changePassword = async (req,res) => {
                try {
                    const {password,password_confirm} = req.body;
                    if(password && password_confirm){
                        if(password !== password_confirm){
                            res.send({"status":"failed","message":"Password and Password Confirm does'nt match"});
                        }else{
                           const changed_hash =  await bcrypt.hash(password,12);
                            await userModel.findOneAndUpdate(req.user._id, {password: changed_hash})
                            res.send({"status":"success","message":"Password Changed"});
                        }
                    }else{
                        res.send({"status":"failed","message":"Password and Password Confirm fields are required"});
                    }
                } catch (error) {
                        console.log(error);
                        res.send({"status":"failed","message":"Request Failed"});
                }
            }
            static loggedUser = (req,res)=> {
                res.send({user:req.user});
            }
            static sendresetpassemail = async (req,res) => {
                const {email} = req.body;
                if(email){
                        const user = await userModel.findOne({email:email});
                        if(user){
                            const secret = user._id + process.env.JWT_SECCRET;
                            const token = jwt.sign({userID:user._id},secret,{expiresIn:'15m'});
                            const link = `http://localhost:8000/api/user/reset/${user._id}/${token}`;
                             let info = await transporter.sendMail({
                             from: process.env.MAIL_FROM, // sender address
                             to: user.email, // list of receivers
                             subject: "Reset Password", // Subject line
                             text: "Reset your password here!", // plain text body
                             html: `<a href = ${link}>Click Here </a>`, // html body
                             });
                            res.send({"status":"success","message":"Link sent to your email!","Info":info});
                        }else{
                            res.send({"status":"failed","message":"Email not exist!"});
                        }
                }else{
                    res.send({"status":"failed","message":"Email is required!"});
                }
            }
            static resetPassword = async (req,res) => {
                const {password, password_confirm} = req.body;
                
                const {id,token} = req.params;
                const user = await userModel.findById(id);
                const new_secret = user._id + process.env.JWT_SECCRET;
                try {
                    jwt.verify(token,new_secret);
                    if(password && password_confirm){
                        if(password !== password_confirm){
                            res.send({"status":"failed","message":"Password and confirm password does'nt match!"});
                        }else{
                            const hash = await bcrypt.hash(password,12);
                            const update = await userModel.findByIdAndUpdate(id,{password:hash});
                            res.send({"status":"success","message":"Password changed success!"});
                        }
                    }else{
                        res.send({"status":"failed","message":"Password and Confirm password is required!"});
                    }
                } catch (error) {
                    
                }
            }
}
module.exports = userController;