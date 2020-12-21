const express = require('express');
const router = express.Router();
const session = require('cookie-session');

router.get('/gmap', (req,res) => {
  	res.status(200).render('map',{lat: req.query.lat, lon: req.query.lon});
  });

module.exports = router;
