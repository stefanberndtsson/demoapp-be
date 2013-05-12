"use strict";

function noteData(dbfile) {
    var sqlite = require('sqlite3');
    var db = new sqlite.Database(dbfile || "development.sqlite3");

    this.index = function(req, callback) {
	db.serialize(function() {
	    var stmt = db.prepare("SELECT * FROM notes WHERE user_id = ?");
	    stmt.all(req.params.userId, function(err, rows) {
		callback(rows);
	    });
	    stmt.finalize();
	});
    }

    this.show = function(req, callback) {
	db.serialize(function() {
	    var stmt = db.prepare("SELECT * FROM notes WHERE user_id = ? AND id = ?");
	    stmt.get(req.params.userId, req.params.id, function(err, row) {
		callback(row);
	    });
	    stmt.finalize();
	});
    }

    this.update = function(req, callback) {
	db.serialize(function() {
	    var newData = req.body;
	    var date = new Date();
	    var stmt = db.prepare("UPDATE notes SET title = ?, body = ?, updated_at = ? WHERE user_id = ? AND id = ?");
	    stmt.run(newData.title, newData.body, date, req.params.userId, req.params.id, function(err) {
		if(!err) { callback(newData); }
	    });
	    stmt.finalize();
	});
    }

    this.create = function(req, callback) {
	db.serialize(function() {
	    var newData = req.body;
	    var date = new Date();
	    var stmt = db.prepare("INSERT INTO notes (user_id, title, body, created_at, updated_at) VALUES (?, ?, ?, ?, ?)");
	    stmt.run(req.params.userId, newData.title, newData.body, date, date, function(err) {
		if(!err) {
		    newData.id = this.lastID;
		    callback(newData);
		}
	    });
	    stmt.finalize();
	});
    }
    return this;
}

module.exports = noteData;
