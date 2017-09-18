var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars'),
		handlebars = require('handlebars'),
    helpers = require('handlebars-form-helpers').register(handlebars);;
var session = require('express-session');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

var hbs = exphbs.create({
    helpers: helpers,
    defaultLayout: 'main'
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', hbs.engine);
//app.engine('handlebars',hdb({defaultLayout:'main'}));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({  secret: 'keyboard cat',  resave: false,  saveUninitialized: true}))

db_user = {};
db_post = [];


app.get('/',function(req,res){
	if (req.session.user !== undefined){
		res.redirect('/home');

	}else{
		//var user = req.session.user;
		res.render('index');
	}
});


app.get('/login',function(req,res){
	res.render('login');
});

app.post('/login',function(req,res){
	var user = req.body.name;
	var pword = req.body.password;
	if (db_user[user]){
		if (db_user[user] == pword){
			req.session.user = user;
			res.redirect('/home')
		}else{
			//res.send('Wrong password!');
			res.redirect('/login');
		}
	}else{
			//res.send('User doesn\'t exist!');
			res.redirect('/login');
		}
});

app.get('/register',function(req,res){
	res.render('register');
});

app.post('/register',function(req,res){
	var user = req.body.name;
	var pword = req.body.password;
	if (db_user[user]){
		//alert("user existed!")
		res.redirect('/register')
		}else{
			db_user[user] = pword;
			req.session.user = user;
			res.redirect('/home');
		}
});

app.get('/home',function(req,res){
	var user = req.session.user;
	res.render('home',{user:user,post:db_post});
});

app.get('/logout',function(req,res){
	delete req.session.user;
	res.redirect('/');
});

app.get('/publish',function(req,res){
	res.render('publish');
});

app.post('/publish',function(req,res){
	var text = req.body.post;
	var user = req.session.user;
	var post={};
	post[text]= text;
	post[user] = user;
	db_post.push(post);
	res.redirect('/');
});

handlebars.registerHelper('ParseContent',function(post, author){
	return post + ' by ' + author
});
//app.listen(3000);
app.listen(process.env.PORT||3000);

/*
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
*/
