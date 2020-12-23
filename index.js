const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const http = require('http');
const url = require('url');
const mongourl = '';
const dbName = 'restaurant';
const express = require('express');
const router = express.Router();
const session = require('cookie-session');
const assert = require('assert');
const app = express();

const findDocument = (db, criteria, callback) => {
    let cursor = db.collection('restaurants').find(criteria);
    console.log(`findDocument: ${JSON.stringify(criteria)}`);
    cursor.toArray((err,docs) => {
        assert.equal(err,null);
        console.log(`findDocument: ${docs.length}`);
        callback(docs);
    });
}

const handle_Find = (req, res, criteria) => {
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

router.get('/', (req,res) => {
	console.log(req.session);
	if (!req.session.authenticated) {
		res.redirect('/login');
	} else {
		handle_Find(req, res, req.query.docs);
	}
});

module.exports = router;
