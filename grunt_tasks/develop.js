// DEVELOP
// Meta task for managing development. Constructs task queues
// on the fly, and prompts users to enter any required information or install
// any required software.

"use strict";

module.exports = function ( grunt ) {
  grunt.registerTask( "develop", function () {
    var asyncDone = this.async();

    grunt.log.writeln( "Initializing live development" );

    grunt.log.ok( "Installing npm packages" );
    grunt.log.ok( "Installing bower components" );
    grunt.log.ok( "Checking JavaScript code quality" );

    grunt.task.run( "concurrent:initDevelop" );

    // Compile app source into usable formats
    grunt.task.run( "concurrent:buildWorld" );

    // Create the browserify bundle
    grunt.task.run( "browserify" );

    // Check for a configuration file before proceeding
    grunt.task.run( "freenas-config" );

    // Begin live development
    grunt.task.run( "begin-livedev" );

    asyncDone();
  });
};
