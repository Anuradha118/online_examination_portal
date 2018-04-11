require('./../configs/config');
var FacebookStrategy=require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var User = require('./../models/User');


module.exports = function (passport) {
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });
    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    // console.log(process.env.FB_CLIENT_ID+' '+process.env.FB_CLIENT_SECRET+' '+process.env.FB_CALLBACK_URL);
    passport.use(new FacebookStrategy({
            clientID: process.env.FB_CLIENT_ID,
            clientSecret: process.env.FB_CLIENT_SECRET,
            callbackURL: process.env.FB_CALLBACK_URL,
            profileFields: ['id', 'emails', 'name']
        },
        function (token, refreshToken, profile, done) {
            console.log(profile);
            console.log(token+'at line 27');
            User.findOne({
                'social.uid': profile.id
            }, function (err, user) {
                if (err)
                    return done(err);
                if (user) {
                    console.log(user);
                    return done(null, user);
                } else {
                    var newUser = new User();
                    newUser.social.uid = profile.id;
                    newUser.social.token = token;
                    newUser.social.name = profile.name.givenName + ' ' + profile.name.familyName;
                    newUser.social.email = profile._json.email;
                    newUser.save(function (err) {
                        if (err)
                            throw err;
                        return done(null, newUser);
                    });
                }
            });
        }));
    
        passport.use(new GoogleStrategy({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL
          },
          function(accessToken, refreshToken, profile, done) {
                process.nextTick(function(){
                    User.findOne({'social.uid': profile.id}, function(err, user){
                        if(err)
                            return done(err);
                        if(user)
                            return done(null, user);
                        else {
                            var newUser = new User();
                            newUser.social.uid = profile.id;
                            newUser.social.token = accessToken;
                            newUser.social.name = profile.displayName;
                            newUser.social.email = profile.emails[0].value;
    
                            newUser.save(function(err){
                                if(err)
                                    throw err;
                                return done(null, newUser);
                            })
                            console.log(profile);
                        }
                    });
                });
            }
    
        ));
};