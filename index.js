#!/usr/bin/env node
var exec = require( "child_process" ).exec;
var grunt = require( "grunt" );
var gruntRun = grunt.cli( [ "--gruntfile", __dirname + "/Gruntfile.js" ] );
// grunt.cli( [ "--gruntfile, __dirname ] );
gruntRun;
