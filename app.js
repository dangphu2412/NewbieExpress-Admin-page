require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const engine = require('ejs-locals');

const app = module.exports = express();
const logger = require('morgan');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const flash = require('connect-flash');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const methodOverride = require('method-override');
const mySlug = require('speakingurl');

const localHelper = require('./helpers/localHelper');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const knex        = require('./database/connection');

const options = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '',
  database: 'app',
  maintainCase: true,
  separator: '_'
};

const sessionStore = new MySQLStore(options);

app.use(session({
  key: 'session_cookie_name',
  secret: 'session_cookie_secret',
  store: sessionStore,
  resave: false,
  saveUninitialized: false
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const User = knex('users').where('id', id).first();
  if (await User) {
    done(null, id);
  }
});
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'https://localhost:3000/auth/google/callback'
},
async (accessToken, refreshToken, profile, done) => { 
  const User = knex('users').where('google_id', profile.id).first();  
  if (await User) {
    done(null, await User);
  } else {
    await knex('users').insert({
      name: profile.displayName,
      username: mySlug(profile.displayName),
      google_id: profile.id
   });
   done(null, await User);
  }
}
));

// override with the X-HTTP-Method-Override header in the request
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(methodOverride('_method'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride((req) => {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    const method = req.body._method;
    delete req.body._method;
    return method;
  }
}));
app.engine('ejs', engine);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/static', express.static('public'));
app.use(express.static(path.join(__dirname, 'upload')));
app.use('/static', express.static('upload'));
app.use(passport.initialize());
app.use(passport.session());


app.use((req, res, next) => {
  res.locals.errors = req.flash('errorInput');
  localHelper(res);
  next();
});
app.use((req, res, next) => {
  res.locals.updated = req.flash('updated');
  localHelper(res);
  next();
});
app.use((req, res, next) => {
  res.locals.duplicated = req.flash('duplicated');
  next();
});

app.use('/admin', indexRouter);
app.use('/', usersRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.log(err);
  
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
