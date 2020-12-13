const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const assert = require('assert');
const http = require('http');
const url = require('url');
const express =require('express');
const router = express.Router();

const mongourl = 'mongodb+srv://dt:s12166654@cluster0.yrpcm.mongodb.net/restaurant?retryWrites=true&w=majority';
const dbName = 'restaurant';

const findDocument = (db, criteria, callback) => {
    let cursor = db.collection('restaurants').find(criteria);
    console.log(`findDocument: ${JSON.stringify(criteria)}`);
    cursor.toArray((err,docs) => {
        assert.equal(err,null);
        console.log(`findDocument: ${docs.length}`);
        callback(docs);
    });
}

const updateDocument = (db, criteria, callback) => {

    /*let cursor = db.collection('restaurants').find(criteria);
    console.log(`updateDocument: ${JSON.stringify(criteria)}`);
    cursor.toArray((err,docs) => {
        assert.equal(err,null);
        console.log(`findDocument: ${docs.length}`);
        callback(docs);
    });*/
}


const rateDocument = (db, criteria, callback) => {
    /*let cursor = db.collection('restaurants').find(criteria);
    console.log(`findDocument: ${JSON.stringify(criteria)}`);
    cursor.toArray((err,docs) => {
        assert.equal(err,null);
        console.log(`findDocument: ${docs.length}`);
        callback(docs);
    });*/
}

const displayDocument = (db, criteria, callback) => {
    /*let cursor = db.collection('restaurants').find(criteria);
    console.log(`findDocument: ${JSON.stringify(criteria)}`);
    cursor.toArray((err,docs) => {
        assert.equal(err,null);
        console.log(`findDocument: ${docs.length}`);
        callback(docs);
    });*/
}


const deleteDocument = (db, criteria, callback) => {

     db.collection('restaurants').deleteMany(criteria, (err,results) => {
        assert.equal(err,null);
        console.log('deleteMany was successful');
        callback(results);
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
            res.status(200).render('list',{nRestaurants: docs.length, restaurants: docs});
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
	    res.status(200).render('details', {restaurant: docs[0]});

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
	    res.status(200).render('edit',{restaurant: docs[0]})

        });
    });
}

/*const handle_Update = (res, criteria) => {
    const client = new MongoClient(mongourl);
    client.connect((err) => {
        assert.equal(null, err);
        console.log("Connected successfully to server");
        const db = client.db(dbName);


        let DOCID = {};
        DOCID['_id'] = ObjectID(criteria._id)
        db.collection('restaurants').updateOne(DOCID,
            {
                $set : {
                    "restaurant_id": criteria.restaurant_id,
                    "mobile": criteria.mobile
                }
            },
            (err, results) => {
                client.close();
                assert.equal(err, null);
                updateDoc['photo'] = new Buffer.from(data).toString('base64');
                updateDocument(DOCID, updateDoc, (results) => {
                    res.status(200).render('info', {message: `Updated ${results.result.nModified} document(s)`})
            }
        );
    });
}*/


Router.get('/', (req,res) => {
    res.redirect('/list');
})

Router.get('/find', (req,res) => {
    handle_Find(res, req.query.docs);
})

Router.get('/details', (req,res) => {

    handle_Details(res, req.query);
})

router.get('/edit', (req,res) => {
    handle_Edit(res, req.query);
})

router.post('/update', (req,res) => {
    handle_Update(req, res, req.query);
})

router.get('/*', (req,res) => {
    res.status(404).render('info', {message: `${req.path} - Unknown request!` });
})

module.exports = router;
