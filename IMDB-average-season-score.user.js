// ==UserScript==
// @name         IMDB-average-season-score
// @description  Shows the average score of a season from any series.
// @version      0.1

// @author       Tim Hänlein
// @namespace    https://github.com/THaenlein
// @downloadURL  https://github.com/THaenlein/imdb-score-filmography/blob/master/IMDB-score.user.js

// @match        http*://www.imdb.com/title/*/episodes?*
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


function calculateAverageScore()
{
    var list = document.getElementsByClassName("list detail eplist")[0].children;
    var items = list.length;
    var i;
    var averageRating = 0;
    var ratings = document.getElementsByClassName("ipl-rating-star small");
    var seasonElement = document.getElementById("episode_top");
    var scoreElement = document.createElement("h3");

    for (i = 0; i < items; i++)
    {
        averageRating = averageRating + Number(ratings[i].children[1].innerHTML);
    }

    averageRating = averageRating / items;

    scoreElement.innerHTML = averageRating.toFixed(1) + "\u2b50";
    scoreElement.setAttribute("id","averageRating");
    seasonElement.appendChild(scoreElement);
    //seasonElement.innerHTML = seasonElement.innerHTML + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + averageRating.toFixed(2) + "\u2b50";
}

$(document).ready(function ()
{
    calculateAverageScore();
    setInterval(function(){
        if(document.getElementById("averageRating") == null)
        {
            calculateAverageScore();
        }
    }, 1000);
})
