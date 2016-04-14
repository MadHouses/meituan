'use strict';

function aaa(name) {
	this.name = name;
}
aaa.prototype.toString = function(){
	return this.name;
}

function fun(cb) {
	cb.apply(new aaa('keller'));
}

fun(() => {
	console.log(this);
})

fun(function(){
	console.log(this);
})