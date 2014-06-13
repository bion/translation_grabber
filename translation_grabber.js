var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');

var ORIGINAL_TEXT_QUERY_STRING = "?SHOW_ORIGINAL_TEXT";
var INDEX_PAGE = 'http://watchingamerica.com/News/author/johnson2/';
var LAST_PATH_REGEXP = /(\w|-)+\/$/

function bodyRequest(url, successCallback) {
    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var $ = cheerio.load(body);
            successCallback($);
        } else {
            console.log("unsuccessful request made to " + url);
            process.exit(1);
        }

    })
}

function extractArticleUrls(callback) {
    return function ($) {
        var urls = [];

        $('.table-striped a').each(
            function (i, el) {
                urls.push(el.attribs.href);
            }
        );

        callback(urls);
    }
}

function extractArticle($) {
    return $('.headcol1 table')
}

function loopOverUrls(urls) {
    var articles = [];

    for (var i = 0; i < urls.length; i++) {
        var name = urls[i].match(LAST_PATH_REGEXP)[0];
        name = name.substring(0, name.length - 1); // get rid of trailing slash
    }

}

bodyRequest(INDEX_PAGE, extractArticleUrls(loopOverUrls));

// for each anchor:
//   pull down page, save contents of 'div.headcol1' to file
//   pull down page + og text query string, save contents of 'div.headcol1' to file
