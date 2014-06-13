var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');

var ORIGINAL_TEXT_QUERY_STRING = "?SHOW_ORIGINAL_TEXT";

// request translator index page

// find list of translation anchors

// for each anchor:
//   pull down page, save contents of 'div.headcol1' to file
//   pull down page + og text query string, save contents of 'div.headcol1' to file
