// ==UserScript==
// @name         IMDB-score
// @description  Shows the corresponding IMDB-score for each movie in the filmogrophy of an actor
// @version      0.1

// @author       Tim Hänlein
// @namespace    https://github.com/THaenlein
// @downloadURL  https://github.com/THaenlein/imdb-score-filmography/blob/master/IMDB-score.user.js

// @match        http*://www.imdb.com/name/*
// @run-at       document-end
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

/*
  MIT License

  Copyright (c) 2018 Tim Hänlein

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.
*/

var apiKey = "YOUR API KEY HERE";

async function addScores()
{
    var list = document.getElementsByClassName("filmo-category-section")[0].children;
    var items = list.length;
    var i;
    for (i = 0; i < items; i++)
    {
        var movieURL = list[i].getElementsByTagName("b")[0].getElementsByTagName("a")[0].getAttribute("href").substring(7, 16);
        var yearElement = list[i].getElementsByClassName("year_column")[0];
        await $.ajax({
            url: "https://www.omdbapi.com/?i=" + movieURL + "&apikey=" + apiKey,
            success: function(data)
            {
                if (!(data.imdbRating == undefined || data.imdbRating == "N/A")) yearElement.innerHTML = data.imdbRating + "\u2b50&nbsp;&nbsp;&nbsp;" + yearElement.innerHTML;
            }
        });
    }
}

$(document).ready(function ()
{
    addScores();
})