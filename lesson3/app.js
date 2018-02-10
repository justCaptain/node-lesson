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
                $('#topic_list .topic_title').each(function(idx,element){
                    var $element = $(element);
                    items.push({
                        title: $element.attr('title'),
                        href: $element.attr('href')
                    });
                });
                res.send(items);
                console.log(items);
            });
});

app.listen(3000,function(){
    console.log('server was start');
});