/*
	author : Miae Kim
*/

//getfile
var fs = require("fs");
//getrss
var FeedParser = require('feedparser');
var request = require('request');
//getcontent
// var Boilerpipe = require('boilerpipe');
//feedlist
var RSSFEEDPATH = "./rssfeedlist.json";

module.exports = {
	getfile : function(filepath){
		var feedlist = fs.readFileSync(filepath,'utf8');
		return feedlist;
	},
	getRSS : function(){
		var self = this;
		var feedlist = eval(this.getfile(RSSFEEDPATH));

		if( !Array.isArray(feedlist)) {
			console.log('THIS IS NOT FEED ERROR')
			return;
		}

		for( i in feedlist) {
			// var i = 0;
			var feed = feedlist[i];
			var data;
			console.log('===============> %s',feed)
			request(feed)
				.on('error', function (error) {
					console.error(error);
				})
				.pipe(new FeedParser())
				.on('error', function (error) {
					console.error(error);
				})
				.on('meta', function (meta) {
					console.log('===== %s =====', meta.title);
				})
				.on('article', function (article) {
					console.log('article: %s', article.title);
					console.log('author: %s',article.author);
					console.log('date : %s', article.date);
					console.log('link: %s', article.link);
					// console.log('content: %s', self.getContent(article.link) || article.description);
				})
				.on('readable', function () {
					var stream = this, item;
					while (item = stream.read()) {
						console.log('article', item)
						console.log('Got article: %s', item.title || item.description );
						console.log('link %s', item.link)
					}
				})
				.on('end', function () {
					console.log('end %s', feed)
				});
		}
		this.javatest();
	
	},
	// getContent : function (link){
	// 	var boilerpipe = new Boilerpipe({
	// 		extractor: Boilerpipe.Extractor.Article,
	// 		url: link
	// 	});
	// 	boilerpipe.getText(function(err, text) {
	// 		return text;
	// 	});
	// 	console.log("AHHHHHHHHHHHHH")
	// 	return null;
	// },
	javatest : function (){
		var java = require("java");
		java.classpath.push("commons-lang3-3.1.jar");
		java.classpath.push("commons-io.jar");

		var list = java.newInstanceSync("java.util.ArrayList");

		java.newInstance("java.util.ArrayList", function(err, list) {
		  list.addSync("item1");
		  list.addSync("item2");
		});

		var ArrayList = java.import('java.util.ArrayList');
		var list = new ArrayList();
		list.addSync('item1');
	}
}