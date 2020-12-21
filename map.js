const express = require('express');
const router = express.Router();
const session = require('cookie-session');
const L = require('leaflet');

router.get('/gmap', (req,res) => {
  var lat = req.query.lat;
  var lon = req.query.lon;
  var map = L.map('map').setView([lat,lon], 12);
  var marker = L.marker([lat,lon]).addTo(map);
  L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw',
    {
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1
    }).addTo(map);
  	res.status(200).render('map',{mapid: map});
  });

module.exports = router;
