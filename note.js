"use strict;"

var resource = require('./resource');
var Note = require('./note-model')();
var resourceNote = resource("/users/:userId/notes", Note);
var User = require('./user-model')();
var resourceUser = resource("/users", User);
resource.express.listen(1337);
