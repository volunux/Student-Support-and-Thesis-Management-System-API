require('dotenv').config();

let createError = require('http-errors');
let cors = require('cors');
let compression = require('compression');
let helmet = require('helmet');
let passport = require('passport');
let session = require('express-session');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');

require('./app_api/helper/passport');

var app = express();

require('./database/db');

app.set('x-powered-by' , false);
app.use(compression());
app.use(helmet());
app.use(cors());
app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'pug');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ 'extended' : false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', (req, res, next) => {

	res.header('Access-Control-Allow-Origin', '*');

	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With,Content-Type,Etag, Accept');
	res.setHeader('Access-Control-Allow-Methods', 'GET , POST , DELETE , PUT , PATCH');

	return next(); });

let apiRoute = require('./app_api/route/route');




app.use(passport.initialize());
app.use(passport.session());

apiRoute(app);


app.use((req , res , next) => { next(createError(404)); });


app.use((err , req , res , next) => {

	res.locals.message = err.message;

	res.locals.error = req.app.get('env') === 'development' ? err : {};

	console.log(err);

	res.status(err.status || 500);

	res.render('error');

});

module.exports = app;
