"use strict";

function User(dbfile) {
    var pg = require('pg');
    var bcrypt = require('bcrypt');
    var db = new pg.Client("tcp://localhost/notey");
    db.connect();

    module.exports.index = function(req, callback) {
	db.query("SELECT * FROM users", function(err, result) {
	    callback(result.rows);
	});
    }

    module.exports.show = function(req, callback) {
	db.query("SELECT * FROM users WHERE id = $1", [req.params.id], function(err, result) {
	    callback(result.rows[0]);
	});
    }

    module.exports.update = function(req, callback) {
	var newData = req.body;
	var date = new Date();
	db.query("UPDATE users SET name = $1, username = $2, updated_at = $3 WHERE id = $4",
		 [newData.name, newData.username, date, req.params.id], function(err) {
		     if(!err) { callback(newData); }
		 });
    }

    module.exports.create = function(req, callback) {
	var newData = req.body;
	var date = new Date();
	if(newData.password == newData.password_verify) {
	    bcrypt.genSalt(10, function(err, salt) {
		bcrypt.hash(newData.password, salt, function(err, hash) {
		    db.query("INSERT INTO users (name, username, password, created_at, updated_at) VALUES ($1, $2, $3, $4, $5) RETURNING id",
			     [newData.name, newData.username, hash, date, date], function(err, result) {
				 if(!err) {
				     newData.id = result.rows[0].id;
				     callback(newData);
				 }
			     });
		});
	    });
	}
    }

    module.exports.authenticate = function(username, password, callback) {
	db.query("SELECT * FROM users WHERE username = $1",
		 [username], function(err, result) {
		     var row = result.rows[0];
		     if(row) {
			 bcrypt.compare(password, row["password"], function(err, res) {
			     if(res) {
				 delete row["password"];
				 callback(true, row);
			     } else {
				 callback(false, null);
			     }
			 });
		     } else {
			 callback(false, null);
		     }
		 });
    }

    module.exports.findById = function(id, callback) {
	db.query("SELECT * FROM users WHERE id = $1", [id], function(err, result) {
	    var row = result.rows[0];
	    if(row) {
		delete row["password"];
		callback(null, row);
	    } else {
		callback(null, false);
	    }
	});
    }
    return module.exports;
}

module.exports = User;
