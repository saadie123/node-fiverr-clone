const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const FacbookStrategy = require('passport-facebook').Strategy;

const config = require('./secret');
const User = require('../models/user');

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

/* Sign in using Email and Password */
passport.use('local-login', new LocalStrategy({
  // by default, local strategy uses username and password, we will override with email
  usernameField : 'email',
  passwordField : 'password',
  passReqToCallback : true // allows us to pass back the entire request to the callback
}, function(req, email, password, done) { // callback with email and password from our form

  // find a user whose email is the same as the forms email
  // we are checking to see if the user trying to login already exists
  User.findOne({ email:  email }, function(err, user) {
    // if there are any errors, return the error before anything else
    if (err)
    return done(err);

    // if no user is found, return the message
    if (!user)
    return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

    // if the user is found but the password is wrong
    if (!user.comparePassword(password))
    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

    // all is well, return successful user
    return done(null, user);
  });

}));

passport.use(new FacbookStrategy({
  clientID: '1996991193873670',
  clientSecret: '514ee260243452d8ddf5bd4824fb0536',
  callbackURL: 'http://localhost:3000/auth/facebook/callback',
  profileFields: ['id','displayName','email']
},(accessToken, refreshToken, profile, cb)=>{
  User.findOne({ facebookId: profile.id }).then(user=>{
    if(user){
      return cb(null,user);
    } else{
      const newUser= new User({
        email: profile._json.email,
        facebookId: profile.id,
        name: profile.displayName,
        photo: 'https://graph.facebook.com/'+profile.id+'/picture?type=large'
      })
      newUser.save().then(savedUser=>{
        return cb(null,savedUser);
      }).catch(err=>{
        console.log(err);
      })
    }
  });
}));


exports.isAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/login');
}
