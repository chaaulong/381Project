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
const createDocument = (createDoc, callback) => {
    const client = new MongoClient(mongourl);
    client.connect((err) => {
        assert.equal(null, err);
        console.log("Connected successfully to server");
        const db = client.db(dbName);
        db.collection('restaurants').insertOne(createDoc, (err, results) => {
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
                removeDocument(DOCID, (results) => {
                    res.status(200).render('info',{name: req.session.username, message:`Deleted 1 document`});
                });
	          } else {
  	            res.status(200).render('info',{name: req.session.username, message:'You are not authorized'});
  	        }
        });
    });
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
            res.status(200).render('search',{name: req.session.username, count: docs.length, restaurants: docs});
        });
    });

}
const handle_Details = (req, res, criteria) => {
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
	          res.status(200).render('display',{name: req.session.username, restaurant:docs[0]});
        });
    });
}
const handle_Edit = (req, res, criteria) => {
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
		        if (docs!="") {
	              res.status(200).render('edit',{name: req.session.username, restaurant:docs[0]});
            } else {
                res.status(200).render('info',{name: req.session.username, message:'You are not authorized'});
            }
        });
    });
}
const handle_Update = (req, res, criteria) => {
        var DOCID = {};
        DOCID['_id'] = ObjectID(req.fields._id);
        var updateDoc = {};
        updateDoc['name'] = req.fields.name;
        updateDoc['restaurant_id'] = req.fields.restaurant_id;
        updateDoc['cuisine'] = req.fields.cuisine;
        updateDoc['borough'] = req.fields.borough;
        updateDoc['address.street'] = req.fields.street;
        updateDoc['address.building'] = req.fields.building;
        updateDoc['address.zipcode'] = req.fields.zipcode;
        updateDoc['address.coord'] = [req.fields.gpslat, req.fields.gpslon];
        if (req.files.filetoupload.size > 0) {
            fs.readFile(req.files.filetoupload.path, (err,data) => {
                assert.equal(err,null);
                updateDoc['photo'] = new Buffer.from(data).toString('base64');
            });
        }
        updateDocument(DOCID, updateDoc, (results) => {
	        res.status(200).render('info',{name: req.session.username, message:`Updated ${results.result.nModified} document(s)`})
        });

}
const handle_rateData = (req, res, criteria) => {
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
            let valid = true;
		        for (let grades of docs[0].grades) {
          	    if (grades['user']==req.session.username) {
				            valid = false;
					          break;
			          }
		        }
		        if (valid) {
			          res.status(200).render('rate',{name: req.session.username, restaurant:docs[0]});
		        } else {
				        res.status(200).render('info',{name: req.session.username, message:'You are not able to rate'});
            }
    		});
	});
}
const handle_Rate = (req, res) => {
    var DOCID = {};
    DOCID['_id'] = ObjectID(req.fields._id);
    var rateDoc = {};
    rateDoc['score'] = parseInt(req.fields.score);
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
			      updateRate(DOCID, rateDoc, (result) => {
                res.status(200).render('info',{name: req.session.username, message:'Success'});
            });
        });
    });
}
const handle_Create = (req, res) => {
	  var createDoc = {};
    createDoc['name'] = req.fields.name;
    createDoc['cuisine'] = req.fields.cuisine;
  	createDoc['borough'] = req.fields.borough;
  	createDoc['photo_mimetype'] = req.fields.photo_mimetype;
  	createDoc['address'] = { "street": req.fields.street, "building": req.fields.building, "coord": [req.fields.gpslat, req.fields.gpslon], "zipcode": req.fields.zipcode };
	  createDoc['restaurant_id'] = req.fields.restaurant_id;
	  createDoc['grades'] = [];
  	createDoc['owner'] = req.session.username;
	  if (req.files.filetoupload.size > 0) {
        fs.readFile(req.files.filetoupload.path, (err,data) => {
            assert.equal(err,null);
                createDoc['photo'] = new Buffer.from(data).toString('base64');
        });
    } if (!req.session.authenticated) {
		    res.status(200).render('info',{name: req.session.username, message: 'Please login to create a new restaurant'});
	  }
	  createDocument(createDoc, (results) => {
	      res.status(200).render('info',{name: req.session.username, message:`Created ${results.insertedCount} document`});
		});
}

router.get('/create',(req,res)=>{
  	res.status(200).render('create',{name:req.session.username});
});
router.post('/create',(req,res)=>{
  	handle_Create(req,res);
});
router.get('/display',(req,res)=>{
    handle_Details(req,res,req.query);
});
router.get('/edit',(req,res)=>{
	  handle_Edit(req,res,req.query);
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
  	handle_rateData(req,res,req.query);
});
router.post('/rated',(req,res)=>{
  	handle_Rate(req,res);
});

module.exports = router;
