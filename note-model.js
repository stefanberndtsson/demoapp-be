"use strict";

function Note(dbfile) {
    var pg = require('pg');
    var db = new pg.Client("tcp://postgres@localhost/notey");
    db.connect();

    module.exports.index = function(req, callback) {
	db.query("SELECT * FROM notes WHERE user_id = $1 ORDER BY created_at DESC", [req.params.userId], function(err, result) {
	    callback(result.rows);
	});
    }

    module.exports.show = function(req, callback) {
	db.query("SELECT * FROM notes WHERE user_id = $1 AND id = $2", [req.params.userId, req.params.id], function(err, result) {
	    callback(result.rows[0]);
	});
    }

    module.exports.update = function(req, callback) {
	var newData = req.body;
	var date = new Date();
	db.query("UPDATE notes SET title = $1, body = $2, updated_at = $3 WHERE user_id = $4 AND id = $5",
		 [newData.title, newData.body, date, req.params.userId, req.params.id], function(err) {
		     if(!err) { callback(newData); }
		 });
    }

    module.exports.create = function(req, callback) {
	var newData = req.body;
	var date = new Date();
	db.query("INSERT INTO notes (user_id, title, body, created_at, updated_at) VALUES ($1, $2, $3, $4, $5) RETURNING id",
		 [req.params.userId, newData.title, newData.body, date, date], function(err, result) {
		     if(!err) {
			 newData.id = result.rows[0].id;
			 callback(newData);
		     }
		 });
    }
    return module.exports;
}

module.exports = Note;
