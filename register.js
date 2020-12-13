const express =require('express');
const router = express.Router();
const session = require('cookie-session');
const users = new Array(
	{name: 'demo', password: ''}
);

router.get('/register', (req,res) => {
	res.status(200).render('register',{});
});

router.post('/register',(req,res) =>{
    if (req.body.username=="" || req.body.password=="" || req.body.passwordConfirm=="") {
        res.status(200).render('register',{error:true});
    } else if (req.body.password!=req.body.passwordConfirm) {
				res.status(200).render('register',{error:true});
		} else {
				users.forEach((user) => {
            if (user.name == req.body.username) {
                res.status(200).render('register',{existed:true});
            } else {
              	req.session.authenticated = true;
                req.session.username = req.body.username;
              	res.redirect('/');
          	}
    	  });
		}
});

module.exports = router;
