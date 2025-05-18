const express = require('express');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const passport = require('passport');
const sequelize = require('./config/db');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback_secret_for_development',
  resave: false,
  saveUninitialized: false,
  store: new SequelizeStore({ 
    db: sequelize,
    tableName: 'sessions',
    expirationTime: 24 * 60 * 60 * 1000  // expires after 1 day
  }),
  cookie: {
    maxTime: 24 * 60 * 60 * 1000,  // expires after 1 day
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'  // Use secure cookies in production
  }
}));

// Initialize Sequelize Store
const sessionStore = new SequelizeStore({ db: sequelize });
sessionStore.sync();

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

// Set view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views/pages'));

// Routes
app.use('/', require('./routes/auth'));
app.use('/hotels', require('./routes/hotels'));
app.use('/itineraries', require('./routes/itineraries'));
app.use('/admin', require('./routes/admin'));

// Home route
app.get('/', (req, res) => {
  res.render('home', { user: req.user });
});

// Sync database and start server
sequelize.sync()
  .then(() => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });