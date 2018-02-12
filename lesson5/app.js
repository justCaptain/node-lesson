var cheerio = require('cheerio');
var superagent = require('superagent');
var async = require('async');
var eventproxy = require('eventproxy'); 


var urls = [];
for(var i=0; i<12; i++)
    urls.push('http://captain_'+i);

var linkcount = 0;
var fetchUrl = function(url,callback){
    var delay = parseInt((Math.random()*10000000)%200,10);
    linkcount++;
    console.log('当前的连接数是：',linkcount,',正在抓的是',url,',耗时：'+delay+'毫秒');
    setTimeout(function(){
        linkcount--;
        // ep.emit('visit_after','html: '+url);
        callback(null,'html content '+url);
    },delay);
}


var ep = eventproxy();
var curentcount = 5;
ep.tail('visit_after',function(ul){
    console.log('完成：'+ul);
    if(curentcount<12){
        var tmp = curentcount;
        fetchUrl(urls[curentcount]);
        curentcount++;
    }
})

var start = function(cnt){
    if(cnt<5){
        fetchUrl(urls[cnt]);
        start(cnt+1);
    }
}

// start(0);


async.mapLimit(urls,5,function(item,callback){
    fetchUrl(item,callback);
},function(err,result){
    console.log('final: ');
    console.log(result);
});