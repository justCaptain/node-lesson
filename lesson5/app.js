var cheerio = require('cheerio');
var superagent = require('superagent');
var async = require('async');

var urls = [];
for(var i=0; i<12; i++)
    urls.push('http://captain_'+i);

var concurrencyCount = 0;
var fetchUrl = function(url,callback){
    var delay = parseInt((Math.random()*10000000)%200,10);
    concurrencyCount++;
    console.log('当前的连接数是：',concurrencyCount,',正在抓的是',url,',耗时：'+delay+'毫秒');
    setTimeout(function(){
        concurrencyCount--;
        callback(null,url+'html content');
    },delay);
}

async.mapLimit(urls,5,function(item,callback){
    fetchUrl(item,callback);
},function(err,result){
    console.log('final: ');
    console.log(result);
});