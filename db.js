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
const createDocument = (criteria, createDoc, callback) => {
    const client = new MongoClient(mongourl);
    client.connect((err) => {
        assert.equal(null, err);
        console.log("Connected successfully to server");
        const db = client.db(dbName);
        db.collection('restaurants').updateOne(criteria,
            {
                $set : createDoc
            },
            (err, results) => {
                client.close();
                assert.equal(err, null);
                callback(results);
            }
        );
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
const updateRate = (criteria, rateDoc, callback) => {
    const client = new MongoClient(mongourl);
      	client.connect((err) => {
        assert.equal(null, err);
        console.log("Connected successfully to server");
        const db = client.db(dbName);
        db.collection('restaurants').updateOne(criteria,
            {
                $push : {grades:
		                rateDoc
            }},
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
const handle_Remove = (res,req, criteria) => {
    let DOCID = {};
    const client = new MongoClient(mongourl);
    DOCID['_id'] = ObjectID(criteria._id);
    DOCID['owner'] = req.session.username;
    client.connect((err) => {
        assert.equal(null, err);
        console.log("Connected successfully to server");
        const db = client.db(dbName);
        let cursor = db.collection('restaurants').find(DOCID);
        cursor.toArray((err,docs) => {
            client.close();
            assert.equal(err,null);
		        if (docs!=""){
                removeDocument(DOCID, (result) => {
                    res.status(200).render('info',{message:'Delete is successful'});
                });
	          } else {
  	            res.status(200).render('info',{message:'You are not authorized'});
  	        }
        });
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
  	res.status(200).render('map');
}
const handle_Search = (req, res, cri) => {
    let criteria = {};
    if (cri.name) {
        criteria[cri.filter] = { $regex: cri.name };
    }
    const client = new MongoClient(mongourl);
    client.connect((err) => {
        assert.equal(null, err);
        console.log("Connected successfully to server");
        const db = client.db(dbName);
        findDocument(db, criteria, (docs) => {
            client.close();
            console.log("Closed DB connection");
            res.status(200).render('index',{name: req.session.username, count: docs.length, restaurants: docs});
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
const handle_Edit = (res, req, criteria) => {
    let DOCID = {};
    const client = new MongoClient(mongourl);
    DOCID['_id'] = ObjectID(criteria._id);
    DOCID['owner']=req.session.username;
    client.connect((err) => {
        assert.equal(null, err);
        console.log("Connected successfully to server");
        const db = client.db(dbName);
        let cursor = db.collection('restaurants').find(DOCID);
        cursor.toArray((err,docs) => {
            client.close();
            assert.equal(err,null);
		        if (docs!=""){
	              res.status(200).render('edit',{restaurant:docs[0]});
            } else {
                res.status(200).render('info',{message:'You are not authorized'});
            }
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
        updateDoc['address.coord[0]'] = req.fields.gpslat;
        updateDoc['address.coord[1]'] = req.fields.gpslon;
        updateDoc['address.coord.0'] = req.fields.gpslat;
        updateDoc['address.coord.1'] = req.fields.gpslon;
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
const handle_rateData = (res, criteria) => {
    const client = new MongoClient(mongourl);
    client.connect((err) => {
        assert.equal(null, err);
        console.log("Connected success to server");
        const db = client.db(dbName);
        let DOCID = {};
        DOCID['_id'] = ObjectID(criteria._id)
        let cursor = db.collection('restaurants').find(DOCID);
        cursor.toArray((err,docs) => {
            client.close();
            assert.equal(err,null);
	          res.status(200).render('rate',{restaurant:docs[0]});
    		});
	});
}
const handle_Rate = (req,res, criteria) => {
    var DOCID = {};
    DOCID['_id'] = ObjectID(req.fields._id);
    DOCID['grades']={$elemMatch:{user:req.session.username}};
    var rateDoc = {};
    rateDoc['score'] = req.fields.score;
    rateDoc['user'] = req.session.username;
    const client = new MongoClient(mongourl);
    client.connect((err) => {
        assert.equal(null, err);
        console.log("Connected successfully to server");
        const db = client.db(dbName);
	      let cursor = db.collection('restaurants').find(DOCID);
	      cursor.toArray((err,docs) => {
            client.close();
	          console.log(docs);
	          console.log('here');
	          assert.equal(err,null);
          	if (docs="") {
                updateRate(DOCID, rateDoc, (result) => {
                    res.status(200).render('info',{message:'Success'});
                });
		        } else {
                res.status(200).render('info',{message:'You have rated already'});
            }
        });
    	});
}

const handle_Create = (req, res, criteria) => {

    var DOCID = {};
    DOCID['_id'] = ObjectID(req.fields._id);
	  var createDoc = {};
    createDoc['name'] = req.fields.name;
    createDoc['cuisine'] = req.fields.cuisine;
  	createDoc['borough'] = req.fields.borough;
  	createDoc['photo_mimetype'] = req.fields.photo_mimetype;
  	createDoc['address.street'] = req.fields.street;
  	createDoc['address.building'] = req.fields.building;
  	createDoc['address.zipcode'] = req.fields.zipcode;
  	createDoc['address.coord[0]'] = req.fields.gpslon;
  	createDoc['address.coord[1]'] = req.fields.gpslat;
  	createDoc['grades.user'] = req.session.username;
  	createDoc['grades.score'] = req.fields.score;
  	createDoc['owner'] = req.session.username;
	  if (req.files.filetoupload.size > 0) {
        fs.readFile(req.files.filetoupload.path, (err,data) => {
            assert.equal(err,null);
                createDoc['photo'] = new Buffer.from(data).toString('base64');
        });
    } else if (req.fields.name =="" || !req.session.authenticated) {
		    res.status(200).render('info',{message: 'Without Name OR OWNER'});
	  }
	  createDocument(DOCID, createDoc, (results) => {
	      res.status(200).render('info',{message:`Created ${results.result.nModified} document`})
		});
}

router.get('/create',(req,res)=>{
  	res.status(200).render('create',{name:req.session.username});
});
router.post('/create',(req,res)=>{
  	handle_Create(req, res, req.query);
});
router.get('/display',(req,res)=>{
    handle_Details(res,req.query);
});
router.get('/edit',(req,res)=>{
	  handle_Edit(res,req,req.query);
});
router.get('/delete',(req,res)=>{
  	handle_Remove(res,req,req.query);
});
router.post('/update',(req,res)=>{
  	handle_Update(req,res,req.query);
});
router.post('/search',(req,res)=>{
  	handle_Search(req,res,req.fields);
});
router.get('/rate',(req,res)=>{
  	handle_rateData(res,req.query);
});
router.post('/rated',(req,res)=>{
  	handle_Rate(req,res,req.query);
});

module.exports = router;
