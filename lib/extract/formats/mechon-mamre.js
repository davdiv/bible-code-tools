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
var iconv = require("iconv-lite");
var sax = require("sax");

var bookNames = ["Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy",
        "Joshua", "Judges", "Samuel", "Kings", "Isaiah", "Jeremiah", "Ezekiel", "Hosea", "Joel", "Amos", "Obadiah", "Jonah",
        "Micah", "Nahum", "Habakkuk", "Zephaniah", "Haggai", "Zechariah", "Malachi",
        "Chronicles", "Psalms", "Job", "Proverbs", "Ruth", "Song of Songs", "Ecclesiastes", "Lamentations", "Esther", "Daniel",
        "Ezra-Nehemiah"
];

var processHTML = function(content, verseFilter) {
    var book;
    var stack = [];
    var keepText = false;
    var parser = new sax.parser(false);
    var updateKeepText = function() {
        var curItem = stack[0];
        keepText = book && (curItem === "P" || curItem === "BIG");
    };
    parser.onopentag = function(node) {
        var name = node.name;
        if (name == "BR") {
            return;
        }
        stack.unshift(name);
        if (keepText) {
            if (name === "B") {
                book.verseSeparation();
            }
        }
        updateKeepText();
    };
    parser.onclosetag = function(name) {
        if (name == "BR") {
            return;
        }
        var checkName = stack.shift();
        if (name !== checkName) {
            throw new Error("Unexpected closing tag: " + name + " != " + checkName);
        } else if (name === "H1") {
            // Now start to capture text
            book = new BookBuilder(verseFilter);
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

module.exports = function(zipFile, verseFilter) {
    var books = [];
    var wholeBookEntry = /\/[^0-9]([0-9]{2}).htm$/;
    zipFile.getEntries().forEach(function(entry) {
        var entryName = entry.entryName;
        var match = wholeBookEntry.exec(entryName);
        if (match) {
            var number = parseInt(match[1], 10);
            var curBookName = bookNames[number - 1];
            if (!curBookName) {
                return;
            }
            console.log("Processing " + entryName + "...");
            var originalData = zipFile.readFile(entry);
            var htmlContent = iconv.decode(originalData, "win1255");
            var curBook = processHTML(htmlContent, verseFilter);
            curBook.bookName = curBookName;
            curBook.originalContent = originalData;
            books.push(curBook);
        }
    });
    return books;
};
