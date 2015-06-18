// SDK-CHECK
// Meta-META (META^2!) task for configuring the freenas-sdk!

"use strict";

module.exports = function ( grunt ) {
  grunt.registerTask( "sdk-check", function ( ) {
    grunt.log.writeln( "Locating your development path" );
    var asyncDone = this.async();
    var confFile = null;

    // Read config file and use the development directory
    confFile = grunt.file.readJSON( "freenas10-conf.json" );
    process.chdir( confFile.guiPath );
    asyncDone();
  });
};
