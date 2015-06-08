// Generated by generator-rotor 0.1.0
// 2014-09-20
"use strict";

var _    = require( "lodash" );
var glob = require( "glob" );


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
  // These are some variables that commonly change during development, and
  // will simplify any changes to file structure, ports, etc.

  // Path variables for Bower components
  var bc = "./bower_components/";
  var bowerConfig =
    { velocity: bc + "velocity"
    , d3: bc + "d3"
    , openSans: { less: bc + "lessfonts-open-sans/src/less"
                , fonts: bc + "lessfonts-open-sans/dist/fonts/OpenSans"
                }
    , fontawesome: { less: bc + "fontawesome/less"
                   , fonts: bc + "fontawesome/fonts"
                   }
    };

  var sourceConfig = { root: "app"
                     , images: "app/source/images"
                     , favicons: "app/source/favicons"
                     , jsx: "app/jsx"
                     , styles: "app/source/styles"
                     , templates: "app/templates"
                     };

  var buildConfig = { root: "app/build/"
                    , app: "app/build/js"
                    , img: "app/build/img"
                    , css: "app/build/css"
                    , font: "app/build/font"
                    , dist: "app/build/js"
                    , ssrjs: "app/ssrjs"
                    };


  // Configuration environment and global variables
  var gruntConfig =
    // Use npm manifest as a list of available packages
    { pkg: grunt.file.readJSON( "package.json" )
    , dirTree: { root: "./"
               , client: "app/client"
               , server: "app/server"
               , routes: "app/server-js/routes"
               , data: "app/data"
               , bower: bowerConfig
               , babel: "./node_modules/babel-core/"
               , internalScripts: "app/source/internalScripts"
               , source: sourceConfig
               , build: buildConfig
               , deployment: "app-deploy"
               }

    // Environment
    , env: { port: 4000 }

    // FreeNAS remote config
    , guiDirectory: "/usr/local/www/gui"
    , configFilePath: "./freenas10-conf.json"
    , conditionalCommands: { enablePkg: ""
                           , installGmake: ""
                           , installGplusplus: ""
                           , symlinkGplusplus: ""
                           , symlinkCplusplus: ""
                           , installNpm: ""
                           , updateNpm: ""
                           }
    , freeNASConfig: { notConfigured: true
                     , remoteHost: null
                     , sshPort: null
                     , guiPath: null
                     , authType: null
                     , keyPath: null
                     , rootPass: null
                     }
  };


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
  // When "grunt" is run with no arguments, run "develop". This will run
  // environment and dependency checkers, manage the FreeNAS remote config file,
  // and bootstrap the FreeNAS environment.

  // Options
  // --local   Start a local dev server, ignore any config files.
  // TODO: --local not working?
  grunt.registerTask( "default", [ "develop" ] );
};
