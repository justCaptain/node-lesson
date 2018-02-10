var eventproxy = require('eventproxy');
var cheerio = require('cheerio');
var superagent = require('superagent');
var url = require('url');

superagent.get('https://cnodejs.org/')
    .end(function(err,res){
        if(err) return next(err);

        var $ = cheerio.load(res.text);
        var topic_url = [];
        var cnodeUrl = 'https://cnodejs.org/';

        $('#topic_list .topic_title').each(function(idx,element){
            var href = url.resolve(cnodeUrl,$(element).attr('href'));
            topic_url.push(href);
        });

        var ep = new eventproxy();
        ep.after('topic_html',topic_url.length,function(topics){
            topics = topics.map(function(topicPair){
                var topicUrl = topicPair[0];
                var topicHtml = topicPair[1];
                var $ = cheerio.load(topicHtml);
                return ({
                    title:$('.topic_full_title').text().trim(),
                    href:topicUrl,
                    comment1:$('.reply_content').eq(0).text().trim(),
                    author:$('.user_name .dark').text().trim()
                });
            });
            console.log(topics);
        });
        topic_url.forEach(function(href){
            superagent.get(href)
                .end(function(err,res){
                    console.log('访问：'+href);
                    ep.emit('topic_html',[href,res.text]);
                });
        });
    });