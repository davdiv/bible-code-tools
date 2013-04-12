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

var fs = require("fs");
var path = require("path");

var booksList = [];
var booksMap = {};
var firstTestament = true;

var makeKey = function(name) {
    return name.replace(/\s+/g, "").toLowerCase();
};

fs.readFileSync(path.join(__dirname, "books-list.txt"), "utf8").split("\n").forEach(function(line) {
    var bookNames = line.split(",");
    var refBookName = bookNames[0];
    if (!refBookName) {
        firstTestament = false;
        return;
    }
    var bookInfo = {
        name: refBookName,
        firstTestament: firstTestament
    };
    booksList.push(bookInfo);
    bookNames.forEach(function(name) {
        var key = makeKey(name);
        if (booksMap.hasOwnProperty(key)) {
            throw new Error("Duplicate key in books list: " + key);
        }
        booksMap[key] = bookInfo;
    });
});

exports.getBookInfo = function(bookId) {
    var key = makeKey(bookId);
    if (booksMap.hasOwnProperty(key)) {
        return booksMap[key];
    } else {
        throw new Error("Unknown Bible book: " + bookId);
    }
}

exports.getBookRefName = function(bookId) {
    var bookInfo = exports.getBookInfo(bookId);
    return bookInfo.name;
};
