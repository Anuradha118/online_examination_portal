require('./../configs/config');
const jwt=require('jsonwebtoken');
var responseGenerator=require('./responsegenerator');

module.exports.auth=function(req,res,next){
    // console.log('inside auth');
    // console.log(req);
    // console.log(req.headers['x-auth']);
    var token=req.body.token||req.query.token||req.headers['x-auth'];

    if(token){

        jwt.verify(token,process.env.JWT_SECRET,function(err,decoded){
            if(err){
                var response=responseGenerator.generate(true,"Authentication Failed",401,null);
                res.json(response);
            }else{
                // console.log(decoded);
                req.user=decoded.payload;
                // console.log(decoded);
                next();
            }
        });


    }
};