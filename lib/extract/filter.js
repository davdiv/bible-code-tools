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

var filterNames = [
        "remove-strange-chars",
        "remove-variants",
        "hebrew-final-letters",
        "hebrew-remove-vowels",
        "remove-punctuation",
        "check-hebrew-only",
        "check-alphanum-only"
];

var autoDisabledFilters = {
    "check-hebrew-only": 1,
    "check-alphanum-only": 1
};

var createFilter = function(config) {
    var filters = [];
    filterNames.forEach(function(name) {
        if (autoDisabledFilters.hasOwnProperty(name) && config[name] !== true) {
            return;
        } else if (config[name] === false) {
            return;
        }
        console.log("Using filter " + name);
        filters.push(require("./filters/" + name));
    });

    return function(text) {
        filters.forEach(function(curFilter) {
            text = curFilter(text, config);
        });
        return text;
    };
};

createFilter.filters = filterNames;

module.exports = createFilter;
