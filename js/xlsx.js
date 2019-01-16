var xlsx = require('node-xlsx');
var fs = require('fs');

module.exports = {
	readFn : function(url) {
		var obj = xlsx.parse(url);
		console.log(JSON.stringify(obj));
		return obj;
	},
	writeFn : function(url, data, next) {
		var buffer = xlsx.build(data);
		fs.writeFile(url, buffer, next);
	}
}
