"use strict";
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("./winston");
var AppError = require("./model/application-error");
var _a = require("express-validator/check"), check = _a.check, validationResult = _a.validationResult;
var path = require('path');
var ElixirValidator = require('./elixir-validator');
var GraphRestriction = require('./keywords/graph_restriction');
var IsChildTermOf = require('./keywords/ischildtermof');
var IsValidTerm = require('./keywords/isvalidterm');
var argv = require("yargs").argv;
var npid = require("npid");
var app = express();
var port = process.env.PORT || 3020;
var elixirValidator = new ElixirValidator([GraphRestriction, IsChildTermOf, IsValidTerm]);
app.use(express.static('src/views'));
// app.use(express.json());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(function (err, req, res, next) {
    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
        var appError = new AppError("Received malformed JSON.");
        logger.log("info", appError.errors);
        res.status(400).send(appError);
    }
    else {
        var appError = new AppError(err.message);
        logger.log("error", appError.errors);
        res.status(err.status).send(appError);
    }
});
// -- Endpoint definition -- //
app.post("/validate", [
    check("schema", "Required.").exists(),
    check("object", "Required.").exists()
], function (req, res) {
    var errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.mapped() });
    }
    else {
        logger.log("debug", "Received POST request.");
        elixirValidator.validate(req.body.schema, req.body.object).then(function (output) {
            logger.log("silly", "Sent validation results.");
            res.status(200).send(output);
        }).catch(function (err) {
            logger.log("error", err.message);
            res.status(500).send(new AppError(err.message));
        });
    }
});
app.get("/validate", function (req, res) {
    logger.log("silly", "Received GET request.");
    res.send({
        message: "This is the Submissions JSON Schema Validator. Please POST to this endpoint the schema and object to validate structured as showed in bodyStructure.",
        bodyStructure: {
            schema: {},
            object: {}
        },
        repository: "https://github.com/elixir-europe/json-schema-validator"
    });
});
app.listen(port, function () {
    logger.log("info", " -- Started server on port " + port + " --");
    if (argv.logPath) {
        logger.log("info", " --> Log output: " + argv.logPath);
    }
});
// -- For monitoring purposes -- //
var pidPath = argv.pidPath || "./server.pid";
try {
    var pid = npid.create(pidPath);
    pid.removeOnExit();
}
catch (err) {
    logger.log("error", err);
    process.exit(1);
}
// Handles crt + c event
process.on("SIGINT", function () {
    npid.remove(pidPath);
    process.exit();
});
// Handles kill -USR1 pid event (monit)
process.on("SIGUSR1", function () {
    npid.remove(pidPath);
    process.exit();
});
//Handles kill -USR2 pid event (nodemon)
process.on("SIGUSR2", function () {
    npid.remove(pidPath);
    process.exit();
});
