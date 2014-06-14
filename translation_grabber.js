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

function writeArticleFunc(article_dir, article_version) {
    return function ($) {
        var article = extractArticle($);
        if (!fs.existsSync(article_dir)) {
            fs.mkdirSync(article_dir);
        }
        fs.writeFile(article_dir + article_version + '.html', article);
    }
}

function loopOverUrls(urls) {
    for (var i = 0; i < urls.length; i++) {
        var article_dir;
        var name = urls[i].match(LAST_PATH_REGEXP)[0];
        article_dir = ARTICLES_DIR + name.substring(0, name.length - 1) + '/';

        bodyRequest(urls[i], writeArticleFunc(article_dir, 'translation'));
        bodyRequest(urls[i] + ORIGINAL_TEXT_QUERY_STRING, writeArticleFunc(article_dir, 'original'));
    }
}

bodyRequest(INDEX_PAGE, extractArticleUrls(loopOverUrls));
