function userData(dbfile) {
    var sqlite = require('sqlite3');
    var db = new sqlite.Database(dbfile || "development.sqlite3");

    this.index = function(req, callback) {
	db.serialize(function() {
	    var stmt = db.prepare("SELECT * FROM users");
	    stmt.all(function(err, rows) {
		callback(rows);
	    });
	    stmt.finalize();
	});
    }

    this.show = function(req, callback) {
	db.serialize(function() {
	    var stmt = db.prepare("SELECT * FROM users WHERE id = ?");
	    stmt.get(req.params.id, function(err, row) {
		callback(row);
	    });
	    stmt.finalize();
	});
    }

    this.update = function(req, callback) {
	db.serialize(function() {
	    var newData = req.body;
	    var date = new Date();
	    var stmt = db.prepare("UPDATE users SET name = ?, username = ?, updated_at = ? WHERE id = ?");
	    stmt.run(newData.name, newData.username, date, req.params.id, function(err) {
		if(!err) { callback(newData); }
	    });
	    stmt.finalize();
	});
    }

    this.create = function(req, callback) {
	db.serialize(function() {
	    var newData = req.body;
	    var date = new Date();
	    var stmt = db.prepare("INSERT INTO users (name, username, password, created_at, updated_at) VALUES (?, ?, ?, ?, ?)");
	    stmt.run(newData.name, newData.username, newData.password, date, date, function(err) {
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

module.exports = userData;
