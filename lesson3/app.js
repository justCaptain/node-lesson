var express = require('express');
var app = express();
var superagent = require('superagent');
var cheerio = require('cheerio');

app.get('/',function(req,res){
    superagent.get('https://cnodejs.org/')
            .end(function(err,sres){
                if(err)
                    return next(err);
                var $ = cheerio.load(sres.text);
                var items = [];
                $('#topic_list .cell').each(function(idx,element){
                    var $cell = $(element);
                    items.push({
                        title: $cell.find('.topic_title').attr('title'),
                        href: $cell.find('.topic_title').attr('href'),
                        author:$cell.find('img').attr('title')
                    });
                });
                res.send(items);
                console.log(items);
            });
});

app.listen(3000,function(){
    console.log('server was start');
});