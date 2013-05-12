"use strict;"

var resource = require('./resource');
var noteData = require('./note-data')();
var resourceNote = resource("/users/:userId/notes", noteData);
//var userData = require('./user-data')();
//var resourceUser = resource("/users", userData);
resource.express.listen(1337);
