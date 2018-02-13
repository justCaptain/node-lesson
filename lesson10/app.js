var Benchmark = require('benchmark');

var suit = new Benchmark.Suite;

var init1 = function(str){
    return +str;
}

var init2 = function(str){
    return parseInt(str,10);
}

var init3 = function(str){
    return Number(str);
}

var number = '1200';

suit
.add('+',function(){
    init1(number);
})
.add('parseInt',function(){
    init2(number);
})
.add('NUMBER',function(){
    init3(number);
})
.on('cycle',function(event){
    console.log(String(event.target));
})
.on('complete',function(){
    console.log('Fast is ' + this.filter('fastest').map('name'));
})
.run({'async':true});