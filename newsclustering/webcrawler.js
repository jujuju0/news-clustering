var fs = require("fs");
var RSSFEEDPATH = "./rssfeedlist.json";
module.exports = {
	getfile : function(filepath){
		var feedlist = fs.readFileSync(filepath,'utf8');
		return feedlist;
	},

	getRSS : function(){
		var feedlist = this.getfile(RSSFEEDPATH);
		for( rss in feedlist ) {
			console.log('rssLINK', rss);
		}
	},

	getContent : function(){
		// this.get
	}
}