#!/usr/bin/env node

var sdk = require("./Gruntfile.js");
var workingDirectory = '.';

if (process.argv.length > 2 ) {
workingDirectory = process.argv[2];
}

sdk.grunt(workingDirectory);
