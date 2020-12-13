const express =require('express');
const router = express.Router();
const session = require('cookie-session');

router.get('/logout', (req,res) => {
	req.session = null;
	res.redirect('/');
});

module.exports = router;
