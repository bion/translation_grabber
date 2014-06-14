var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');

var ARTICLES_DIR = '../watching_america/scraped_articles/';

var ORIGINAL_TEXT_QUERY_STRING = "?SHOW_ORIGINAL_TEXT";
var INDEX_PAGE = 'http://watchingamerica.com/News/author/johnson2/';
var LAST_PATH_REGEXP = /(\w|-)+\/$/;

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
    return $('.headcol1 td').html();
}

function writeArticleFunc(article_dir) {
    return function ($) {
        var article = extractArticle($);
        fs.mkdirSync(article_dir);
        fs.writeFileSync(article_dir + 'english.html', article);
    }
}

function loopOverUrls(urls) {
    for (var i = 0; i < urls.length; i++) {
        var name = urls[i].match(LAST_PATH_REGEXP)[0];
        var article, article_dir;

        name = name.substring(0, name.length - 1); // get rid of trailing slash

        article_dir = ARTICLES_DIR + name + '/';

        bodyRequest(urls[i], writeArticleFunc(article_dir));
    }

}

bodyRequest(INDEX_PAGE, extractArticleUrls(loopOverUrls));

// for each anchor:
//   pull down page, save contents of 'div.headcol1' to file, use fs.mkdir to make directory for it, save english version
//   pull down page + og text query string, save contents of 'div.headcol1'
