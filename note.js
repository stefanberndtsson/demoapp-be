"use strict;"

var resource = require('./resource');
var Note = require('./note-model')();
var User = require('./user-model')();
var passport = require('passport');
var passportLocal = require('passport-local').Strategy;

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function (err, user) {
	done(err, user);
    });
});

resource.express.use(resource.expressMod.cookieParser());
resource.express.use(resource.expressMod.session({ secret: 'funky fan', cookie: { httpOnly: false } }));
resource.express.use(passport.initialize());
resource.express.use(passport.session());

passport.use(new passportLocal(
    function(username, password, done) {
	User.authenticate(username, password, function(result, user) {
	    if(result) {
		return done(null, user);
	    } else { 
		return done(null, false);
	    }
	});
    }
));

resource.express.get("/login", function(req, res, next) {
    resource.corsHeaders(res, next);
});
resource.express.get("/login", passport.authenticate('local'), function(req, res) {
    res.json(req.user);
});

resource.express.get("/whoami", function(req, res, next) {
    resource.corsHeaders(res, next);
});
resource.express.get("/whoami", function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
	if(!req.user) {
	    res.statusCode = 401;
	    res.end();
	} else {
	    res.json(req.user);
	}
    })(req, res, next);
});

resource("/users/:userId/notes", Note, passport);
resource("/users", User);
resource.express.listen(1337);
