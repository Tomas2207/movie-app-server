if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const app = express();

const cors = require('cors');

const session = require('cookie-session');
const passport = require('passport');
const passportLocal = require('passport-local').Strategy;
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');

const User = require('./models/User');

//Middleware

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(
  cors({
    origin: `${process.env.ORIGIN}`,
    credentials: true,
  })
);

app.use(cookieParser('secret'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('trust proxy');
app.use(
  session({
    name: '__session',
    keys: ['key1'],
    maxAge: 24 * 60 * 60 * 100,
    secure: true,
    httpOnly: true,
    sameSite: 'none',
  })
);

app.use(passport.initialize());
app.use(passport.session());
require('./passportConfig')(passport);

//-------------------------------

//mongoose
const mongoose = require('mongoose');
const mongoDb = process.env.DATABASE_URL;
mongoose.connect(mongoDb, {
  useNewUrlParser: true,
});

const db = mongoose.connection;
db.on('error', (error) => console.log(error));
db.once('open', () => console.log('connected to database'));
//-------------------------------

app.use(express.json());

//passport routes

app.post('/login', async (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) throw err;
    if (!user) res.json("User doesn't exist");
    else {
      req.logIn(user, (err) => {
        if (err) throw err;
        res.json('Succesfully Authenticated');
        req.session.user = req.user;
        console.log(req.user);
      });
    }
  })(req, res, next);
});
app.post('/register', async (req, res) => {
  const user = await User.findOne({ username: req.body.username });

  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  if (user == null) {
    const newUser = new User({
      name: req.body.name,
      lastname: req.body.lastname,
      username: req.body.username,
      password: hashedPassword,
      img: {
        url: 'https://res.cloudinary.com/dbejjbpof/image/upload/v1667862401/members-message-user/user_1_rd7tyx.png',
      },
    });
    res.json({ message: 'New User Created' });
    await newUser.save();
  } else {
    res.json({ message: 'The User Already Exists' });
  }
});

app.get('/user', (req, res) => {
  console.log('req.user', req.user);
  res.json(req.user);
});

app.get('/logout', (req, res, next) => {
  try {
    req.logout();
    delete req.session;
    delete req.user;
  } catch (error) {
    console.log(error);
  }
  res.json('Succesfully logged out');
});

//routes

const watchlistRouter = require('./routes/Watchlist');
const profileRouter = require('./routes/profile');

app.use('/watchlist', watchlistRouter);
app.use('/profile', profileRouter);

app.listen(process.env.PORT || 5000, () => console.log('Server started'));
