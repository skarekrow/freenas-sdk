// SDK-CHECK
// Meta-META (META^2!) task for configuring the freenas-sdk!

"use strict";

var fs       = require( "fs" );
var inquirer = require( "inquirer" );
var chalk    = require( "chalk" );

module.exports = function ( grunt ) {
  grunt.registerTask( "sdk-check", function ( ) {
    // Path variables for Bower components
    grunt.log.writeln( "Locating your sdk path" );

    var asyncDone = this.async();
    var confFile = null;
    if ( fs.exists( "./freenas10-conf.json" ) ) {
      confFile = grunt.file.readJSON( "freenas10-conf.json" );
    }
    var confLocation = [
      { name    : "guiPath"
      , message : "Where is your gui development folder?"
      , default : confFile ? confFile.guiPath : "."
    }];

    inquirer.prompt( confLocation, function ( answers ) {
      if ( answers["guiPath"] ) {
        // Resolve any tildes in path to key file, if provided
        // (i.e ~/sdk-path)
        if ( answers["guiPath"].indexOf( "~" ) !== -1 ) {
          answers["guiPath"] = resHome( answers["guiPath"] );
        }
        process.chdir( answers["guiPath"] );
        asyncDone();
      } else {
        grunt.log.writeln(
          chalk.yellow( "WARNING: A guiPath must be specified for " +
                        "this SDK to work." )
        );
        grunt.task.clearQueue();

        // End state reached:
        // There is no configuration file, and the user has not created one
        asyncDone();
      }
    })
  });
};
