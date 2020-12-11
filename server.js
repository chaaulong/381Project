const express = require('express');
const session = require('cookie-session');
const bodyParser = require('body-parser');
const app = express();
const SECRETKEY = 'I want to pass COMPS381F';

const users = new Array(
	{name: 'demo', password: ''}
);

app.set('view engine','ejs');

app.use(session({
  name: 'loginSession',
  keys: [SECRETKEY]
}));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req,res) => {
	console.log(req.session);
	if (!req.session.authenticated) {
		res.redirect('/login');
	} else {
		res.status(200).render('secrets',{name:req.session.username});
	}

});
app.get('/register', (req,res) => {
	res.status(200).render('register',{});
});

app.post('/register',function(req,res){
    if (req.body.username=="" || req.body.password=="") {
        res.status(200).render('register');
    } else {
			  if (req.body.password!=req.body.passwordConfirm) {
						res.status(200).render('register');
				} else {
						users.forEach((user) => {
            		if (user.name == req.body.username) {
                		res.status(200).render('register');
            		} else {
                		req.session.authenticated = true;
                		req.session.username = req.body.username;
                		res.redirect('/');
            		}
        	});
    		}
			}
});

app.get('/login', (req,res) => {
	res.status(200).render('login',{});
});

app.post('/login', (req,res) => {
	users.forEach((user) => {
		if (user.name == req.body.username && user.password == req.body.password) {

			req.session.authenticated = true;
			req.session.username = req.body.username;
		}else{
			res.redirect('/register');}
	});
	res.redirect('/');
});

app.get('/logout', (req,res) => {
	req.session = null;
	res.redirect('/');
});

app.listen(process.env.PORT || 8099);
