const User = require('./models/User');
const bcrypt = require('bcryptjs');
const localStrategy = require('passport-local').Strategy;

function Passport(passport) {
  passport.use(
    new localStrategy((username, password, done) => {
      User.findOne({ username: username }, (err, user) => {
        if (err) throw err;
        if (!user) return done(null, false);
        bcrypt.compare(password, user.password, (err, result) => {
          if (err) throw err;
          if (result == true) {
            return done(null, user);
          } else {
            return done(null, false);
          }
        });
      });
    })
  );

  passport.serializeUser(function (user, done) {
    console.log('serialize User, user:');
    console.log(user);
    console.log('***');
    done(null, { _id: user._id });
  });

  passport.deserializeUser(async (id, done) => {
    console.log('deserialize user ');
    User.findById(id)
      .then((user) => {
        console.log('deserialize user, user: ');
        console.log(user);
        console.log('***');
        done(null, user);
      })
      .catch((err) => {
        console.log(err);
        done(err);
      });
  });
}

module.exports = Passport;
