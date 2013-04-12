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

var BookBuilder = require("../book-builder");
var sax = require("sax");
var iconv = require("iconv-lite");

var processXML = function(content, verseFilter) {
    var book = new BookBuilder(verseFilter);
    var stack = [];
    var keepText = false;
    var parser = new sax.parser(true);
    var updateKeepText = function() {
        var curItem = stack[0];
        keepText = (curItem === "v" || curItem === "c");
    };
    parser.onopentag = function(node) {
        var name = node.name;
        if (name === "q") {
            return;
        }
        stack.unshift(name);
        if (keepText) {
            if (name === "p" || name === "pi" || name === "br") {
                book.appendText("\n");
            } else if (name === "vn") {
                book.verseSeparation();
            } else if (name == "cn") {
                book.chapterSeparation();
            }
        }
        updateKeepText();
    };
    parser.onclosetag = function(name) {
        if (name === "q") {
            return;
        }
        var checkName = stack.shift();
        if (name !== checkName) {
            throw new Error("Unexpected closing tag: " + name + " != " + checkName);
        }
        updateKeepText();
    };
    parser.ontext = function(chars) {
        if (keepText) {
            book.appendText(chars);
        }
    };
    parser.write(content).close();
    return book;
};


var getStringContent = function(data) {
    var utfData = data.toString("utf8"); // suppose it's UTF-8 to read encoding
    var encodingMatch = /encoding=\"([^"]+)\"/.exec(utfData);
    if (!encodingMatch) {
        throw new Error("No encoding in file!");
    }
    var encoding = encodingMatch[1];
    if (encoding === "UTF-8") {
        return utfData; // already computed
    } else {
        return iconv.decode(data, encoding);
    }
};

module.exports = function(zipFile, verseFilter) {
    var newVerseFilter = function(text) {
        text = text.replace("[Q]", "");
        return verseFilter(text);
    };
    var books = [];
    var wholeBookEntry = /^BIB\/([0-9A-Z]{3}).xml$/;
    zipFile.getEntries().forEach(function(entry) {
        var entryName = entry.entryName;
        var match = wholeBookEntry.exec(entryName);
        if (match) {
            console.log("Processing " + entryName + "...");
            var originalData = zipFile.readFile(entry);
            var stringContent = getStringContent(originalData);
            var curBook = processXML(stringContent, newVerseFilter);
            curBook.bookName = match[1];
            curBook.originalContent = originalData;
            books.push(curBook);
        }
    });
    return books;
};
