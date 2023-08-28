const express=require('express');
const router=express.Router();
const user=require('../models/User');
const bcrypt = require('bcrypt');
router.post('/signup',(req,res)=>{
    let {name,email,password}=req.body;
    name=name.trim();
    email=email.trim();
    password=password.trim();
    if(name=="" || email=="" || password==""){
        res.json({
            status:"FAILED",
            message:"Empty input fileds"
        });

    }
    else if(!/^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/.test(name)){
        res.json({
            status:"FAILED",
            message:"Invalid name entered"
        });
    }
    else if(!/^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$/.test(email)){
        res.json({
            status:"FAILED",
            message:"Invalid email entered"
        });
    }
    else if(password.length<8){
        res.json({
            status:"FAILED",
            message:"password too short"
        });
    }
    else{
        user.find({email}).then(result=>{
                if(result.length){
                    res.json({
                        status:"FAILED",
                        message:"A user exists with the given email"
                    })
                }
                else{
                    const saltRounds=10;
                    bcrypt.hash(password,saltRounds).then(hashedPassword=>{
                            const newUser= new user({
                                name,
                                email,
                                password:hashedPassword
                            });
                            newUser.save().then(result=>{
                                res.json({
                                    status:"SUCCESS",
                                    message:"successfuly added a new user",
                                    data:result
                                })
                            }).catch(error=>{
                                console.log(error);
                                res.json({
                                    status:"FAILED",
                                    message:"an error occured while adding a new user"
                                })
                            })
                    }).catch(error=>{
                        console.log(error);
                        res.json({
                            status:"FAILED",
                            message:"an error occured while hashing the password"
                        })
                    })
                }
        }).catch(error=>{
            console.log(error);
            res.json({
                status:"FAILED",
                message:"an error occured whilechecking for an existing user"
            })
        })
    }
});
router.post('/login',(req,res)=>{
    let {email,password}=req.body;
    email=email.trim();
    password=password.trim();
    if( email=="" || password==""){
        res.json({
            status:"FAILED",
            message:"Empty input fileds"
        });

    }
    else{
        user.find({email}).then(data=>{
            if(data.length){
                const hashedPassword=data[0].password;
                bcrypt.compare(password,hashedPassword).then(result=>{
                    if(result){
                        res.json({
                            status:"SUCCESS",
                            message:"Login Successful",
                            data:data
                        })
                    }
                    else{
                        res.json({
                            staus:"FAILED",
                            message:"Passwords didnt match"
                        })
                    }
                }).catch(error=>{
                    res.json({
                        staus:"FAILED",
                        message:"An error occured while comparing the passwords"
                    })
                })
            }
        }).catch(error=>{
            res.json({
                staus:"FAILED",
                message:"An error occured while checking for an existing user"
            })
        });
    }
});

module.exports=router;