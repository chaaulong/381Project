const express = require('express');
const router = express.Router();
const session = require('cookie-session');

router.get('/search', (req,res) => {
	res.status(200).render('search', {name: req.session.username});
});

module.exports = router;
