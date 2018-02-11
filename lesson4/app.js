/**
 * 
 *  实现: 总是有5个请求（任何时候都在抓5个页面）
 *  API:  ep.tail(task,backcall)   
 *  描述: 只要触发task事件,就执行回调
 *  实现思路：
 *      1、先用递归执行发送5个并发请求
 *      2、只要抓到页面，就触发回调
 *      3、在回调中再抓一次页面，回调再触发这个事件
 *      4、用计数控制好递归调用的次数；
 *  
 *  
 */

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
        var count = 5;
        ep.tail('updata',function(topicPair){
            var topicUrl = topicPair[0];
            var topicHtml = topicPair[1];
            var $ = cheerio.load(topicHtml);
            console.log({
                title:$('.topic_full_title').text().trim(),
                href:topicUrl,
                comment1:$('.reply_content').eq(0).text().trim(),
                author:$('.user_name .dark').text().trim()
            });
            if(count<(topic_url.length)){
                var tmp = count;
                superagent.get(topic_url[count])
                    .end(function(err,res){
                        ep.emit('updata',[topic_url[tmp],res.text]);
                    });
                count++;
            }
        });
        function start(cnt){
            if(cnt<5){
                superagent.get(topic_url[cnt])
                    .end(function(err,res){
                        ep.emit('updata',[topic_url[cnt],res.text]);
                    });
                start(cnt+1);
            }
        }
        start(0);
    });