const express =require('express');
const router = express.Router();
const session = require('cookie-session');
const users = new Array(
	{name: 'demo', password: ''}
);


router.get('/login', (req,res) => {
	res.status(200).render('login',{});
});

router.post('/login', (req,res) => {
	
	users.forEach((user) => {
		if (user.name == req.body.username && user.password == req.body.password) {

			req.session.authenticated = true;
			req.session.username = req.body.username;
		}else{
			res.redirect('/register');}
	});
	res.redirect('/');
});


module.exports = router;
