'use strict';

var path = require('path');
//var rootPath = path.normalize(__dirname + '/../..');
var rootPath = path.normalize(__dirname);

var config = {};
//Default to 54321 if no port is provided
config.http_port = parseInt(process.argv[2]) || 54321;

config.root = rootPath;

module.exports = config;
