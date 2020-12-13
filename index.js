const express =require('express');
const router = express.Router();
const session = require('cookie-session');


router.get('/', (req,res) => {
	console.log(req.session);
	if (!req.session.authenticated) {
		res.redirect('/login');
	} else {
		res.status(200).render('index',{name:req.session.username});
		
	}
	

});

module.exports = router;
