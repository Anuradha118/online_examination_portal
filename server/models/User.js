var mongoose = require('mongoose');
var jwt=require('jsonwebtoken');
var bcrypt=require('bcryptjs');

var userSchema = new mongoose.Schema({
    local:{
        firstname: {
            type: String
        },
        lastname: {
            type: String
        },
        email: {
            type: String
        },
        mobile: {
            type: String
        },
        password: {
            type: String
        }
    },
    social:{
        uid: {
            type: String
        },
        token: {
            type: String
        },
        email:{
            type:String
        },
        name: {
            type: String
        }
    }
});

userSchema.methods.generateToken=function(payload){
    console.log(payload);
    // var user=this;
    var access='auth';
    var token=jwt.sign({payload,access},process.env.JWT_SECRET,{expiresIn:'30m'});
    return token;
};

userSchema.methods.isValidPassword=function(password,callback){
    var user=this;
    if (!user.local.password)
      return false;
    bcrypt.compare(password,user.local.password,function(err,valid){
        if(err){
            throw err;
        }else{
            return callback(valid);
        }
    });
};

userSchema.pre('save',function(next){
    var user=this;
    console.log('inside save');
    if(user.isModified('local.password')){
        bcrypt.genSalt(10,(err,salt)=>{
            bcrypt.hash(user.local.password,salt,(err,hash)=>{
                user.local.password=hash;
                next();
            });
        });
    }else{
        next();
    }
});

var User = module.exports = mongoose.model('User', userSchema);