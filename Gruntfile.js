// Generated by generator-rotor 0.1.0
// 2014-09-20
"use strict";

var _        = require( "lodash" );
var glob     = require( "glob" );

// Gruntfile
// =============================================================================
// This file is the 'control panel' for the entire project. Grunt is a
// JavaScript task runner, capable of automating, parallelizing, and simplifying
// common development tasks.

// Wrapper function for Grunt
module.exports = function ( grunt ) {

  // Force use of Unix newlines
  grunt.util.linefeed = "\n";

  // GRUNT CONFIGURATION AND GLOBAL VARIABLES
  // Load task configurations from grunt_tasks/config
  function loadConfig ( path ) {
    var object = {};
    var ConfigFile;
    var key;

    // Iterate over all config module files, and create a single config object.
    glob.sync( "*", { cwd: path } ).forEach( function ( option ) {
      // Each task file contains a constructor capable of creating a
      // representative options object for its task.
      ConfigFile = require( path + option );
      key = option.replace( /\.js$/, "" );
      // Invoke constructor, append output to configuration object, keyed by the
      // name of its task.
      object[key] = new ConfigFile( grunt );
    });

    return object;
  }

  // DEVELOPMENT VARIABLES
  // =====================
  // Read variables from a JSON configuration file.
  // These are some variables that commonly change during development, and
  // will simplify any changes to file structure, ports, etc.

  var pkg = grunt.file.readJSON( "package.json" );
  var gruntConfig = grunt.file.readJSON( "grunt_config.json" );
  gruntConfig.pkg = pkg;

  // Load external configuration files
  _.assign( gruntConfig, loadConfig( "./grunt_tasks/config/" ) );

  grunt.initConfig( gruntConfig );

  // LOAD GRUNT TASKS FROM NPM
  // ===========================================================================
  // Here, we tell grunt to load the packages from package.json. Tasks must be
  // loaded before they can be called.

  require( "load-grunt-tasks" )( grunt );


  // LOAD OTHER GRUNT TASKS
  // ===========================================================================
  // This section contains grunt tasks which have been defined locally, not via
  // npm. Configuration tools and modularized grunt tasks belong here.

  // Registers task: 'bootstrap', installed as local module
  grunt.loadTasks( "grunt_tasks" );


  // DEFAULT
  // This will run environment and dependency checkers,
  // manage the FreeNAS config file and bootstrap the FreeNAS environment.

  grunt.registerTask( "default", [ "freenas-config", "sdk-check", "develop" ] );
};
