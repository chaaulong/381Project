const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const assert = require('assert');
const http = require('http');
const url = require('url');
var express = require('express');
var router = express.Router();
const mongourl = 'mongodb+srv://dt:s12166654@cluster0.yrpcm.mongodb.net/restaurant?retryWrites=true&w=majority';
const fs = require('fs');
const formidable = require('express-formidable');
const dbName = 'restaurant';
router.use(formidable());

const findDocument = (db, criteria, callback) => {
    let cursor = db.collection('restaurants').find(criteria);
    console.log(`findDocument: ${JSON.stringify(criteria)}`);
    cursor.toArray((err,docs) => {
        assert.equal(err,null);
        console.log(`findDocument: ${docs.length}`);
        callback(docs);
    });
}
const updateDocument = (criteria, updateDoc, callback) => {
    const client = new MongoClient(mongourl);
    client.connect((err) => {
        assert.equal(null, err);
        console.log("Connected successfully to server");
        const db = client.db(dbName);

         db.collection('restaurants').updateOne(criteria,
            {
                $set : updateDoc
            },
            (err, results) => {
                client.close();
                assert.equal(err, null);
                callback(results);
            }
        );
    });
}
const removeDocument = (criteria,callback) => {
    const client = new MongoClient(mongourl);
    client.connect((err) => {
        assert.equal(null, err);
        console.log("Connected successfully to server");
        const db = client.db(dbName);
         db.collection('restaurants').remove(criteria,
            (err, results) => {
                client.close();
                assert.equal(err, null);
                callback(results);
            }
        );
    });
}
const handle_Gmap = (res,criteria) =>{
	var lat = criteria._lat;
	var lon = criteria._lon;
	var map = L.map('mapid');
  	map.setView(new L.LatLng(lat,lon), 12);
  	var osmUrl='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  	var osm = new L.TileLayer(osmUrl, {minZoom: 8, maxZoom: 16});
  	map.addLayer(osm);
	res.status(200).render('map')
	};

const handle_Remove = (res, criteria) => {
        var DOCID = {};
        DOCID['_id'] = ObjectID(criteria._id)
                removeDocument(DOCID,(results) => {
		res.status(200).render('info',{message:'Delete was successful'})
                });
        }

const handle_Find = (res, criteria) => {
    const client = new MongoClient(mongourl);
    client.connect((err) => {
        assert.equal(null, err);
        console.log("Connected successfully to server");
        const db = client.db(dbName);

        findDocument(db, criteria, (docs) => {
            client.close();
            console.log("Closed DB connection");
	    res.status(200).render('list',{nRestaurants:docs.length,restaurants:docs});
        });
    });
}

const handle_Details = (res, criteria) => {
    const client = new MongoClient(mongourl);
    client.connect((err) => {
        assert.equal(null, err);
        console.log("Connected successfully to server");
        const db = client.db(dbName);

        let DOCID = {};
        DOCID['_id'] = ObjectID(criteria._id)
        findDocument(db, DOCID, (docs) => {
            client.close();
            console.log("Closed DB connection");
	    res.status(200).render('display',{restaurant:docs[0]});
        });
    });
}

const handle_Edit = (res, criteria) => {
    const client = new MongoClient(mongourl);
    client.connect((err) => {
        assert.equal(null, err);
        console.log("Connected successfully to server");
        const db = client.db(dbName);

        let DOCID = {};
        DOCID['_id'] = ObjectID(criteria._id)
        let cursor = db.collection('restaurants').find(DOCID);
        cursor.toArray((err,docs) => {
            client.close();
            assert.equal(err,null);

	    res.status(200).render('edit',{restaurant:docs[0]});
        });
    });
}
const handle_Update = (req, res, criteria) => {
        var DOCID = {};
        DOCID['_id'] = ObjectID(req.fields._id);
        var updateDoc = {};
        updateDoc['name'] = req.fields.name;
        updateDoc['cuisine'] = req.fields.cuisine;
	updateDoc['borough'] = req.fields.borough;
	updateDoc['address.street'] = req.fields.street;
	updateDoc['address.building'] = req.fields.building;
	updateDoc['address.zipcode'] = req.fields.zipcode;
	updateDoc['address.coord[0]'] = req.fields.gpslon;
	updateDoc['address.coord[1]'] = req.fields.gpslat;
        if (req.files.filetoupload.size > 0) {
            fs.readFile(req.files.filetoupload.path, (err,data) => {
                assert.equal(err,null);
                updateDoc['photo'] = new Buffer.from(data).toString('base64');
                updateDocument(DOCID, updateDoc, (results) => {
		res.status(200).render('info',{message:`Updated ${results.result.nModified} document(s)`})
                });
            });
        } else {
            updateDocument(DOCID, updateDoc, (results) => {
	res.status(200).render('info',{message:`Updated ${results.result.nModified} document(s)`})
            });
        }
}


router.get('/display',(req,res)=>{
	handle_Details(res,req.query);
	});

router.get('/gmap',(req,res)=>{
	handle_Gmap(res,req.query);
	});

router.get('/edit',(req,res)=>{
	handle_Edit(res,req.query);
	});

router.get('/delete',(req,res)=>{
	handle_Remove(res,req.query);
	});

router.post('/update',(req,res)=>{
	handle_Update(req, res, req.query);
	});

/* ---- To be completed ----
router.get('/search',(req,res)=>{
	handle_Find(res,req.query.docs);
	})
*/

module.exports = router;
