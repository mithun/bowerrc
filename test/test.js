#!/usr/bin/env node

// Strict Mode
'use strict';

// Load dependencies
var exec = require('exec');
var path = require('path');
var fs = require('fs-extra');
var assert = require('assert');
var isThere = require("is-there");

describe('Testing bowerrc', function () {

    var localHome = path.join(__dirname, 'home');
    var scriptPath = path.join(__dirname, '..', 'bowerrc.js');
    fs.emptyDirSync(localHome);
    fs.writeFileSync(path.join(localHome, '.bowerrc'), '');

    // Set dummy paths
    beforeEach(function () {
        process.env.HOME = localHome;
        process.env.USERPROFILE = localHome;
    });

    it('Runs first time correctly', function () {
        exec(['node', scriptPath], function (err, out, code) {
            if (err) {
                throw (err);
            }
            if (code === 0) {
                assert.strictEqual(true, isThere(path.join(localHome, '.bowerrcs')));
                assert.strictEqual(true, fs.lstatSync(path.join(localHome, '.bowerrc')).isSymbolicLink());
            }
        });
    });

    it('Uses bowerrc correctly', function () {

        fs.outputFileSync(path.join(localHome, '.bowerrcs', 'new'), '');

        exec(['node', scriptPath, 'new'], function (err, out, code) {
            if (err) throw (err);
            if (code === 0) {
                assert.strictEqual(path.join(localHome, '.bowerrcs', 'new'), fs.readlinkSync(path.join(localHome, '.bowerrc')));
            }
        });
    });
});
