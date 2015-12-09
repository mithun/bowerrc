#!/usr/bin/env node

/*
    #
    # bowerrc -- Switch between different .bowerrc files
    #
    # https://github.com/mithun/bowerrc
    #
    # Inspired by https://github.com/deoxxa/npmrc
    #
*/

// Strict Mode
'use strict';

// Load Dependencies
var exit = require('exit');
var path = require('path');
var fs = require('fs-extra');
var isThere = require("is-there");
var homeDir = require('home-dir').directory;

// Load this module's package.json
var pkg = require('./package.json');

// Set directory where bowerrcs are managed
var bowerrcStore = path.join(homeDir, '.bowerrcs');

// Set default bowerrc filename
var bowerrcLinkTarget = path.join(homeDir, '.bowerrc');

/*
###############
#  FUNCTIONS  #
###############
*/

// init
function initRc() {

    // Check if ~/.bowerrcs exists. If it does, init is done
    if (!isThere(bowerrcStore)) {

        // Create ~/.bowerrcs
        console.log('Creating ' + bowerrcStore);
        fs.mkdirsSync(bowerrcStore);

        // Create default rc
        var defaultBowerrc = path.resolve(path.join(bowerrcStore, 'default')),
            currentBowerrc = path.resolve(path.join(homeDir, '.bowerrc'));

        if (isThere(currentBowerrc)) {

            // Copy
            console.log('Copying %s -> %s', currentBowerrc, defaultBowerrc);
            fs.copySync(fs.realpathSync(currentBowerrc), defaultBowerrc);

            // unlink
            fs.removeSync(currentBowerrc);

            // re-link to default
            console.log('Linking %s -> %s', bowerrcLinkTarget, defaultBowerrc);
            fs.ensureSymlinkSync(defaultBowerrc, bowerrcLinkTarget);
        }
    }
}

// list
function listRcs() {

    var currentBowerrc;
    if (isThere(bowerrcLinkTarget)) {
        currentBowerrc = fs.realpathSync(bowerrcLinkTarget);
    }

    if (isThere(bowerrcStore)) {
        var storeContents = fs.readdirSync(bowerrcStore);
        storeContents.forEach(function (rcFile) {
            var rcFileReal = fs.realpathSync(path.join(bowerrcStore, rcFile));
            if (rcFileReal === currentBowerrc) {
                console.log('* ' + rcFile);
            } else {
                console.log('  %s', rcFile);
            }
        });
    }
}

// use
function useRc(fileToUse, callback) {
    var fileToUsePath = path.join(bowerrcStore, fileToUse);
    if (!isThere(fileToUsePath)) {
        callback(new Error(fileToUse + ' is not available'));
    }
    var fileToUsePathReal = fs.realpathSync(fileToUsePath);

    if (isThere(bowerrcLinkTarget)) {
        var currentBowerrc = fs.realpathSync(bowerrcLinkTarget);
        if (currentBowerrc === fileToUsePathReal) {
            console.log('%s is already in use', fileToUse);
            callback(0);
            return (0);
        }

        fs.unlinkSync(bowerrcLinkTarget);
    }

    console.log('Linking %s -> %s', bowerrcLinkTarget, fileToUsePath);
    fs.ensureSymlinkSync(fileToUsePath, bowerrcLinkTarget);
}

// help
function printHelp() {
    console.log(
        'bowerrc\n' + '\n' + '     Switch between different .bowerrc files\n' + '\n' + 'USAGE:\n' + '\n' + '     bowerrc         list all bowerrcs\n' + '     bowerrc [name]  use a specific bowerrc\n' + '\n' + '%s version v%s',
        'bowerrc',
        pkg.version
    );
}

/*
    ##############
    #  COMMANDS  #
    ##############
*/

// No args
if (process.argv.length === 2) {
    initRc();
    listRcs();
}

// We need one argument
if (process.argv.length > 2) {

    // And that's the only one we care about
    var script_arg = process.argv[2];

    if (script_arg.toLowerCase() === '-h' || script_arg.toLowerCase() === '--help') {
        printHelp();
    } else if (script_arg.toLowerCase() === '-v' || script_arg.toLowerCase() === '--version') {
        console.log('%s version v%s', 'bowerrc', pkg.version);
    } else {
        useRc(script_arg, function (err) {
            if (err) {
                console.error(err);
                exit(1);
            }
        });
    }
}

// Done
exit(0);
