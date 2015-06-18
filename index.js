#!/usr/bin/env node
var npm = require( "npm" );
var grunt = require( "grunt" );
// helper variable to store module name globally
var modName = __dirname.match( /([^\/]*)\/*$/ )[1]

npm.load( {}, function ( ) {
  var modDir = npm.config.get( "prefix" ) + "/lib/node_modules/" + modName;
  try {
    process.chdir( modDir );
    grunt.cli();
  } catch ( err ) {
    console.log( "Error in navigating to module directory: ", err );
    console.log( " The directory path being: ", modDir );
  }
});
