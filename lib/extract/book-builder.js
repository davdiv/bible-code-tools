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

var BookBuilder = function(verseFilter) {
    this.bookName = "";
    this.originalContent = "";
    this._verseFilter = verseFilter;
    this._verses = [];
    this._curVerse = [];
    this._needSeparation = false;
    this._needChapterSeparation = false;
};

BookBuilder.prototype.appendText = function(text) {
    text = text.replace(/\s+/g, " ");
    var spaceBegin = text.charAt(0) === " ";
    var begin = spaceBegin ? 1 : 0;
    var end = text.length;
    var spaceEnd = text.charAt(end - 1) === " ";
    if (spaceEnd) {
        end--;
    }
    if (spaceBegin) {
        this._needSeparation = true;
    }
    if (end - begin > 0) {
        var out = this._curVerse;
        if (this._needSeparation && out.length > 0) {
            out.push(" ");
        }
        this._needSeparation = false;
        out.push(text.substring(begin, end));
        if (spaceEnd) {
            this._needSeparation = true;
        }
    }
};

BookBuilder.prototype.verseSeparation = function() {
    if (this._curVerse.length > 0) {
        var verseContent = this._curVerse.join("");
        this._curVerse = [];
        var verseFilter = this._verseFilter;
        verseContent = verseFilter(verseContent);
        if (verseContent.length > 0) {
            if (this._needChapterSeparation && this._verses.length > 0) {
                this._verses.push(""); // empty verse to mark a chapter separation
            }
            this._needChapterSeparation = false;
            this._verses.push(verseContent);
        }
    }
};

BookBuilder.prototype.chapterSeparation = function() {
    this.verseSeparation();
    this._needChapterSeparation = true;
};

BookBuilder.prototype.getProcessedContent = function() {
    this.chapterSeparation();
    return this._verses.join("\n");
};

BookBuilder.prototype.getOriginalContent = function() {
    return this.originalContent;
};

module.exports = BookBuilder;
