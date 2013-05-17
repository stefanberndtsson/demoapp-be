var expressMod = require('express');
var express = expressMod();
express.use(expressMod.bodyParser());

var corsHeaders = function(res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3012');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'POST, PUT, DELETE, GET, OPTIONS');
    res.header('Access-Control-Allow-Headers', '*, Pragma, X-Requested-With, X-Prototype-Version, X-CSRF-Token, Content-Type');
    res.header('Access-Control-Max-Age', "1728000");
    next();
}

function NCResource(mountIn, dataObject, passport) {
    console.log("Mount resource: ", mountIn);
    if(passport) {
	express.use(expressMod.cookieParser());
	express.use(expressMod.session({ secret: 'funky fan', cookie: { httpOnly: false } }));
	express.use(passport.initialize());
	express.use(passport.session());
    }

    express.all('*', function(req, res, next) {
	corsHeaders(res, next);
    });

    express.get(mountIn, function(req, res, next) {
	if(passport) {
	    passport.authenticate('local', function(err, user, info) {
		if(!req.user) {
		    res.statusCode = 401;
		    res.end();
		} else {
		    dataObject.index(req, function(data) { res.json(data); })
		}
	    })(req, res, next);
	} else {
	    dataObject.index(req, function(data) { res.json(data); })
	}
    });

    express.get(mountIn+'/:id', function(req, res, next) {
	passport.authenticate('local', function(err, user, info) {
	    if(!req.user) {
		res.statusCode = 401;
		res.end();
	    } else {
		dataObject.show(req, function(data) { res.json(data); })
	    }
	})(req, res, next);
    });

    express.put(mountIn+'/:id', function(req, res, next) {
	passport.authenticate('local', function(err, user, info) {
	    if(!req.user) {
		res.statusCode = 401;
		res.end();
	    } else {
		dataObject.update(req, function(data) { res.json(data); })
	    }
	})(req, res, next);
    });

    express.post(mountIn, function(req, res, next) {
	if(passport) {
	    passport.authenticate('local', function(err, user, info) {
		if(!req.user) {
		    res.statusCode = 401;
		    res.end();
		} else {
		    dataObject.create(req, function(data) { res.json(data); })
		}
	    })(req, res, next);
	} else {
	    dataObject.create(req, function(data) { res.json(data); })
	}
    });

    express.delete(mountIn+'/:id', function(req, res, next) {
	passport.authenticate('local', function(err, user, info) {
	    if(!req.user) {
		res.statusCode = 401;
		res.end();
	    } else {
		dataObject.destroy(req, function(data) { res.json(data); })
	    }
	})(req, res, next);
    });

    return this;
}

module.exports = NCResource;
module.exports.express = express;
module.exports.expressMod = expressMod;
module.exports.corsHeaders = corsHeaders;
