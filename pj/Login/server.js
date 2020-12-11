const express = require('express');
const session = require('cookie-session');
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');
const app = express();

app.set('view engine','ejs');

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
    var matched_users_promise = User.findAll({
        where:  Sequelize.and(
                {username: req.body.username}                
            )
    });
    matched_users_promise.then(function(users){ 
        if(users.length == 0){
            const passwordHash = bcrypt.hashSync(req.body.password,10);
            User.create({
                username: req.body.username,
                password: passwordHash
            }).then(function(){
               res.redirect('/');
            });
        }
        else{
            res.render('account/register',{errors: "Username already in user"});
        }
    })
});

app.get('/login', (req,res) => {
	res.status(200).render('login',{});
});

app.post('/login', (req,res) => {
	users.forEach((user) => {
		if (user.name == req.body.name && user.password == req.body.password) {
			
			req.session.authenticated = true;        
			req.session.username = req.body.name;	 	
		}
	});
	res.redirect('/');
});

app.get('/logout', (req,res) => {
	req.session = null;  
	res.redirect('/');
});

app.listen(process.env.PORT || 8099);
