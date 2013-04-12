#!/usr/bin/env node

/*
 * Bible Code tools
 * Copyright (C) 2013 - DivDE <divde@free.fr>
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

var extract = require("../lib/extract/extract.js");
var inputFormats = extract.inputFormats;
var optimist = require("optimist").usage("Usage: $0 -f [format] -i [input-file] -o [output-directory]").options({
    "f": {
        alias: "format",
        describe: "Input format. It must be one of the following " + inputFormats.length + " formats: " + inputFormats.join(", "),
        demand: true,
        string: true
    },
    "i": {
        alias: "input",
        describe: "Input file. It must be an existing zip file.",
        demand: true,
        string: true
    },
    "o": {
        alias: "output",
        describe: "Output directory. It will be created and must not already exist.",
        demand: true,
        string: true
    },
    "h": {
        alias: "help",
        describe: "Only displays this help message and exits.",
        boolean: true
    },
    "stack": {
        describe: "If an error occurs, displays the stack trace (for debugging purposes).",
        boolean: true
    }
}).wrap(100);

var argv = optimist.argv;

if (argv.h) {
    optimist.showHelp();
} else {
    try {
        extract(argv);
    } catch (error) {
        if (argv.stack) {
            console.error(error.stack);
        } else {
            console.error(error + "");
        }
    }
}
