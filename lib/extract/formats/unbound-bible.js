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

var util = require("util");
var ParentBookBuilder = require("../book-builder");

var BookBuilder = function() {
    ParentBookBuilder.apply(this, arguments);
    this.originalContent = [];
};

util.inherits(BookBuilder, ParentBookBuilder);

BookBuilder.prototype.appendText = function(text) {
    this.originalContent.push(text);
    return ParentBookBuilder.prototype.appendText.call(this, text);
};

BookBuilder.prototype.getOriginalContent = function() {
    return this.originalContent.join("\n");
};

var processData = function(data, verseFilter, bookNames) {
    var lines = data.split(/\r?\n\r?/);
    var booksArray = [];
    var books = {};
    lines.forEach(function(line) {
        if (/^\s*(\#|$)/.test(line)) {
            // a comment or an empty line
            return;
        }
        var fields = line.split("\t");
        var bookId = fields[0];
        var chapter = parseInt(fields[1], 10);
        var verse = parseInt(fields[2], 10);
        var text = fields[fields.length - 1];
        var currentBook;
        if (books.hasOwnProperty(bookId)) {
            currentBook = books[bookId];
        } else {
            currentBook = books[bookId] = new BookBuilder(verseFilter);
            currentBook.bookName = bookNames[bookId];
            booksArray.push(currentBook);
        }
        if (verse === 1) {
            currentBook.chapterSeparation();
        } else {
            currentBook.verseSeparation();
        }
        currentBook.appendText(text);
    });
    return booksArray;
};

var getBookNames = function(data) {
    var res = {};
    var lines = data.split(/\r?\n\r?/);
    lines.forEach(function(line) {
        var fields = line.split("\t");
        if (fields.length === 2) {
            res[fields[0]] = fields[1];
        }
    });
    return res;
};

module.exports = function(zipFile, verseFilter) {
    var books;
    var bookNamesEntry = zipFile.getEntry("book_names.txt");
    var bookNames = getBookNames(zipFile.readFile(bookNamesEntry).toString("utf8"));
    var wholeBibleEntry = /_utf8.txt$/;
    zipFile.getEntries().forEach(function(entry) {
        var entryName = entry.entryName;
        if (!books && wholeBibleEntry.test(entryName)) {
            var data = zipFile.readFile(entry);
            books = processData(data.toString("utf8"), verseFilter, bookNames);
        }
    });
    return books;
};
