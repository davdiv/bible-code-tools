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

/**
 * In hebrew, 5 letters have a different display depending on whether they are inside a word or at the end.
 * This filter replaces the final version by the usual one.
 */
module.exports = function(text) {
    return text.replace(/[\u05DA\u05DD\u05DF\u05E3\u05E5]/g, function(char) {
        // The code for the usual display is following the code for the final display.
        return String.fromCharCode(char.charCodeAt(0) + 1);
    });
};
