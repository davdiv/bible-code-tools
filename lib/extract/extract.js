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
var filter = require("./filter");
var Zip = require("adm-zip");
var booksList = require("../books-list");

var extract = function(config) {
    var outputDirectory = config.output;
    if (fs.existsSync(outputDirectory)) {
        throw new Error(outputDirectory + " already exists.");
    }
    var books = extract.getBooks(config);
    fs.mkdirSync(outputDirectory);
    books.forEach(function(book) {
        var bookId = book.bookName;
        var bookRefName = booksList.getBookRefName(bookId);
        var fileName = path.join(outputDirectory, bookRefName);
        var originalContent = book.getOriginalContent();
        if (originalContent) {
            fs.writeFileSync(fileName + ".src.txt", originalContent);
        }
        fs.writeFileSync(fileName + ".out.txt", book.getProcessedContent());
    });
    console.log("Extracted " + books.length + " books successfully.");
};

extract.inputFormats = ["unbound-bible", "mechon-mamre", "visionneuse"];

extract.getBooks = function(config) {
    var format = config.format.toLowerCase();
    if (extract.inputFormats.indexOf(format) === -1) {
        throw new Error("Unknown format: " + format);
    }
    var verseFilter = filter(config);
    var inputFileName = config.input;
    var inputFile = new Zip(inputFileName);
    var extractFormat = require("./formats/" + format);
    return extractFormat(inputFile, verseFilter, config);
};

module.exports = extract;
