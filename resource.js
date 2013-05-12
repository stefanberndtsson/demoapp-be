var expressMod = require('express');
var express = expressMod();

function NCResource(mountIn, dataObject) {
    console.log("Mount resource: ", mountIn);
    express.use(expressMod.bodyParser());

    express.all('*', function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'POST, PUT, DELETE, GET, OPTIONS');
	res.header('Access-Control-Allow-Headers', '*, X-Requested-With, X-Prototype-Version, X-CSRF-Token, Content-Type');
	res.header('Access-Control-Max-Age', "1728000");
	next();
    });

    express.get(mountIn, function(req, res) {
	dataObject.index(req, function(data) { res.json(data); })
    });

    express.get(mountIn+'/:id', function(req, res) {
	dataObject.show(req, function(data) { res.json(data); })
    });

    express.put(mountIn+'/:id', function(req, res) {
	dataObject.update(req, function(data) { res.json(data); })
    });

    express.post(mountIn, function(req, res) {
	dataObject.create(req, function(data) { res.json(data); })
    });

    return this;
}

module.exports = NCResource;
module.exports.express = express;