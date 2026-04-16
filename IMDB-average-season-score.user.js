// ==UserScript==
// @name         IMDB-average-season-score
// @description  Shows the average score of a season from any series.
// @version      0.2

// @author       Tim Hänlein
// @namespace    https://github.com/THaenlein
// @downloadURL  https://github.com/THaenlein/imdb-score-filmography/raw/master/IMDB-average-season-score.user.js

// @match        *://www.imdb.com/title/*/episodes*
// @match        *://www.imdb.com/*/title/*/episodes*
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


function getCurrentTitleId() {
    var match = window.location.pathname.match(/\/title\/(tt\d+)/);
    return match ? match[1] : "";
}

function parseRatingValue(text) {
    var valueMatch;
    var value;

    if (!text) {
        return NaN;
    }

    valueMatch = text.match(/(\d+(?:[.,]\d+)?)\s*\/\s*10/);
    if (!valueMatch) {
        return NaN;
    }

    value = Number(valueMatch[1].replace(",", "."));
    if (isNaN(value) || value <= 0 || value > 10) {
        return NaN;
    }

    return value;
}

function extractEpisodeId(container, currentTitleId) {
    var links = container.querySelectorAll('a[href*="/title/tt"]');
    var i;
    var idMatch;
    var id;

    for (i = 0; i < links.length; i++) {
        idMatch = links[i].getAttribute("href").match(/\/title\/(tt\d+)/);
        if (!idMatch) {
            continue;
        }

        id = idMatch[1];
        if (id !== currentTitleId) {
            return id;
        }
    }

    return "";
}

function getEpisodeRatings() {
    var currentTitleId = getCurrentTitleId();
    var cards = document.querySelectorAll("main article");
    var seenEpisodeIds = {};
    var ratings = [];
    var i;
    var episodeId;
    var ratingElement;
    var value;
    var cardText;

    for (i = 0; i < cards.length; i++) {
        cardText = cards[i].textContent || "";
        if (!/S\d+\.\s*E\d+/i.test(cardText)) {
            continue;
        }

        episodeId = extractEpisodeId(cards[i], currentTitleId);
        if (!episodeId || seenEpisodeIds[episodeId]) {
            continue;
        }

        ratingElement = cards[i].querySelector(".ipc-rating-star--imdb");
        value = parseRatingValue(ratingElement ? ratingElement.textContent : cardText);

        if (!isNaN(value)) {
            seenEpisodeIds[episodeId] = true;
            ratings.push(value);
        }
    }

    return ratings;
}

function getInsertTarget() {
    var heading = document.querySelector('main h2, main h1');
    if (heading && heading.parentElement) {
        return heading.parentElement;
    }
    return document.querySelector("main");
}

function renderAverageScore(ratings) {
    var existing = document.getElementById("averageRating");
    var target = getInsertTarget();
    var scoreElement;
    var sum = 0;
    var averageRating;
    var i;

    if (!target) {
        return;
    }

    if (existing) {
        existing.remove();
    }

    if (!ratings.length) {
        return;
    }

    for (i = 0; i < ratings.length; i++) {
        sum = sum + ratings[i];
    }
    averageRating = sum / ratings.length;

    scoreElement = document.createElement("h3");
    scoreElement.setAttribute("id", "averageRating");
    scoreElement.style.margin = "8px 0 16px";
    scoreElement.textContent = "Season average: " + averageRating.toFixed(1) + "\u2b50";
    target.appendChild(scoreElement);
}

function calculateAverageScore() {
    renderAverageScore(getEpisodeRatings());
}

function setupAverageScoreObserver() {
    var observer;
    var timeoutId;
    var main = document.querySelector("main");

    if (!main) {
        return;
    }

    calculateAverageScore();

    observer = new MutationObserver(function () {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(calculateAverageScore, 200);
    });

    observer.observe(main, { childList: true, subtree: true });
}

setupAverageScoreObserver();
