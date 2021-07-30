const userModel=require('../model/User.js');
const rooms=require('../model/rooms.js')
const bcrypt=require('bcrypt');
const mongoose=require('mongoose');

exports.getRegistrationView=(req,res,next)=>{
    res.render("User/register.hbs");
};
exports.getLoginView=(req,res,next)=>{
    res.render("User/login.hbs");
};
exports.logout=(req,res)=>{
    req.session.destroy();
    res.redirect("/");

};
exports.getAdminDashboard=(req,res,next)=>{
    res.render("User/adminDashboard.hbs");
};
exports.processUserFormData=(req,res)=>{
    const newUser={
        firstName=req.body.fName,
        lastName=req.body.lName,
        telephone:req.body.phone,
        email:req.body.emailLogReg,
        password:req.body.passLogReg
    };
    const user=userModel(newUser);
    
    userModel.findOne({email:req.body.emailLogReg}).then((quser)=>{
        if(quser===null){
            user.save().then(()=>{
                res.redirect("/User/dashboard");
            });
        } else{
            res.render("User/register",{
                emErr:"This email address is already in use"
            });
        }
    }).catch(()=>{
        res.render("User/register.hbs",{
            emErr:"This email address is in use"
        });
    });
}

exports.processLogin=(req,res)=>{
    userModel.findOne({email:req.body.emailLog}).then((user)=>{
        if(user==null){
            res.render("User/login",{
                emErr: "Email and/or password is incorrect",
                pErr:"Email and/or password is incorrect"
            });
        } else{
            bcrypt.compare(req.body.passLog, user.password).then((isMatched)=>{
                if(isMatched){
                    req.session.userInfo=user;
                    res.redirect("/User/dashboard");
                } else{
                    res.render("User/login",{
                        emErr: "Email and/or password is incorrect",
                        pErr: "Email and/or password is incorrect"
                    });
                }
            }).catch((err)=>console.log(`Error with login:${err}`));
        }
    }).catch((err)=>console.log(`Error with login:${err}`))
};