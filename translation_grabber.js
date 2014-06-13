var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');

var ORIGINAL_TEXT_QUERY_STRING = "?SHOW_ORIGINAL_TEXT";
var INDEX_PAGE = 'http://watchingamerica.com/News/author/johnson2/';

// request translator index page
function bodyRequest(url, success) {
    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            success(body);
        } else {
            console.log("unsuccessful request made to " + url);
            process.exit(1);
        }

// find list of translation anchors
    })
}

// for each anchor:
//   pull down page, save contents of 'div.headcol1' to file
//   pull down page + og text query string, save contents of 'div.headcol1' to file
