require('./../configs/config');
var router=require('express').Router();
var mongoose=require('./../db/mongoose');
var events=require('events');
var randomString=require('random-string');
var sendotp=require('sendotp');
var _=require('lodash');
var bcrypt=require('bcryptjs');
var jwt=require('jsonwebtoken');
var passport = require('passport');
var nodemailer=require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');
var User=require('./../models/User');
var responseGenerator=require('./../utils/responsegenerator');
var custValidator=require('./../utils/validator');
var eventEmitter = new events.EventEmitter();
var myResponse={};

eventEmitter.on('send_otp',function(info){

    // send otp to the registered mobile number and email address.
    const send_otp=new sendotp(process.env.MSG91_AUTHKEY,"OTP for resetting the password is {{otp}}. Please donot share it with anybody");
    send_otp.send(info.mobile,"EdAcademy",info.id,function(error,data,response){
        console.log(data);
    });
    var options = {
        auth: {
            api_user: process.env.SENDGRID_USER,
            api_key: process.env.SENDGRID_SECRET
        }
    };
    var client = nodemailer.createTransport(sgTransport(options));

    const email = {
        from: 'edAcademy <support@edAcademy.com>', // sender address
        to: info.email, // list of receivers
        subject: 'Password Reset', // Subject line
        html: `<p>You have initiated a password reset.<br/>OTP for resetting the password : <b style="color:red">${info.id}</b>.Never share the OTP with anyone.</p>` // plain text body
    };

    client.sendMail(email, function (err, info) {
        if (err)
            console.log(err);
        else
            console.log("huh " + info);
    });
});

router.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
});

//api for local sign up
router.post('/signup',custValidator.signup,function(req,res){
    User.findOne({
        'local.email':req.body.email
    },function(err,user){
        if(err){
            myResponse=responseGenerator.generate(true, "Some error", 500, null);
            res.send(myResponse);
        }else if(user){
            myResponse=responseGenerator.generate(true,'User alaready exist!',409,null);
            res.send(myResponse);
        }else{
            var newUser=new User();
            newUser.local.firstname=req.body.firstname;
            newUser.local.lastname=req.body.lastname;
            newUser.local.email=req.body.email;
            newUser.local.mobile=req.body.mobile;
            newUser.local.password=req.body.password;

            newUser.save().then(()=>{
                console.log('successfully saved');
                myResponse=responseGenerator.generate(false,"Account created successfully! Now you can Login!!", 200, null);
                res.send(myResponse);
            }).catch((err)=>{
                myResponse=responseGenerator.generate(true,"Some error",500,null);
                res.send(myResponse);
            })
        }
    })
});

//API for local signin
router.post('/signin',custValidator.signin,function(req,res){
    var body=_.pick(req.body,['email','password']);
    User.findOne({$or: [{'local.email':req.body.email},{'social.email':req.body.email}]},function(err,user){
        if(err){
            myResponse=responseGenerator.generate(true, "Some error", 500, null);
            res.send(myResponse);
        }else if(user==null){
            myResponse=responseGenerator.generate(true, "Invalid username", 400, null);
            res.send(myResponse);
        }else if(user){
            user.isValidPassword(body.password,function(valid){
                if(valid){
                    var payload=user.local.toObject();
                    delete payload.password;
                    var token=user.generateToken(payload);
                    myResponse=responseGenerator.generate(false,"Login Successful.",200,{user:user.local,token:token});
                    res.send(myResponse);
                }else{
                    myResponse=responseGenerator.generate(true,"Wrong Password or Password didn't match",400,null);
                    res.send(myResponse);
                }
            });
        }
    });
});

//API to rest password
router.post('/reset-password', custValidator.resetPassword,function (req, res) {
    var password = req.body.password;
    bcrypt.genSalt(10,(err,salt)=>{
        bcrypt.hash(password,salt,(err,hash)=>{
            password=hash;
            console.log(req.session.email);
            User.findOneAndUpdate({
                'local.email': req.session.email
            }, {
                $set: {
                    'local.password': password
                }
            }, function (err, doc) {
                console.log(doc);
                if (err) {
                    myResponse = responseGenerator.generate(true, "Some Internal Error", 500, null);
                    res.send(myResponse);
                } else {
                    myResponse = responseGenerator.generate(false, "Password changed successfully", 200, null);
                    res.send(myResponse);
                }
            });
        });
    });
    
});

//API for forgot password
router.post('/forgot-password', custValidator.forgotPassword,function (req, res) {
    var email = req.body.email;
    req.session.email = email;
    req.session.shortid = randomString({length:4,numeric:true,letters:false,special:false});
    User.findOne({'local.email':email},function(err,user){
        // console.log(user);
        if(err){
            console.log(err);
        }else{
            eventEmitter.emit('send_otp', {
                email: email,
                mobile:user.local.mobile,
                id: req.session.shortid
            });
            var response = responseGenerator.generate(false, "OTP sent successfully to your registered mobile number", 200, req.session.shortid);
            res.json(response);
        }
    });
});

// API to verify the OTP
router.get('/verify-otp', function (req, res) {
    var id = req.query.otp;
    if (id === req.session.shortid) {
        myResponse = responseGenerator.generate(false, "Unique ID matched", 200, req.session.shortid);
        res.json(myResponse);
    } else {
        myResponse = responseGenerator.generate(true, "Unique ID didn't match", 400, null);
        res.json(myResponse);
    }
});

//api for facebook signin
router.get('/signin/facebook',
        passport.authenticate('facebook',{scope: ['email']})
);

//api for facebook signin callback
router.get('/signin/facebook/callback',
        passport.authenticate('facebook', { 
            failureRedirect: '/signin' 
        }),function (req, res) {
            res.redirect("/#/signin");
        }
);

//api for google signin
router.get('/signin/google', 
    passport.authenticate('google', {scope: ['profile', 'email']})
);

//api for google signin callback
router.get('/signin/google/callback', 
	  passport.authenticate('google', { 
          failureRedirect: '#/signin' 
        }),function (req, res) {
            res.redirect("/#/signin");
        }
);

//api to get all user details when signed-in through google or facebook
router.get('/userDetails', function (req, res) {
    if (req.user) {
        var payload = req.user.social.toObject();
        // var result = payload.toObject();
        var access='auth';
        var token=jwt.sign({payload,access},process.env.JWT_SECRET,{expiresIn:30*60});
        var email=req.user.social;
        myResponse = responseGenerator.generate(false, "Token Issued", 200, {user:email,token:token});
        res.send(myResponse);
    }
});

//api to logout of the session
router.get('/logout', function(req, res){
    req.logout();
    myResponse=responseGenerator.generate(false,"User Logout successful",200,null);
    res.send(myResponse);
});

// api to get all registered users by admin
router.get('/user/allUsers',function(rreq,res){
    var regusers=[];
    User.find({'local.email':{$ne:'admin@edacademy.com'}},function(err,users){
        if(err){
            myResponse=responseGenerator.generate(true,'Some Internal Error',500,null);
            res.send(myResponse);
        }else if(!users){
            myResponse=responseGenerator.generate(false,'No users have registered yet',200,null);
            res.send(myResponse);
        }else{
            console.log(users.length);
            for(var i=0;i<users.length;i++){
                console.log(!users[i].local);
                if(JSON.stringify(users[i].local)==='{}'){
                    regusers.push(users[i].social);
                }else{
                    regusers.push(users[i].local);
                }
            }
            for(var j=0;j<regusers.length;j++){
                console.log(regusers[j]);
            }
            myResponse=responseGenerator.generate(false,'All registered users',200,regusers);
            res.send(myResponse);
        }
    });
});

module.exports = router;