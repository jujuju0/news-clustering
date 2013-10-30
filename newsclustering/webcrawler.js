/*
	author : Miae Kim ( http://facebook.com/sweet.miae.kim )
*/
module.exports = {
	getRSS : function(){
		var self = this;
		var FeedParser = require('feedparser');
		var request = require('request');
		var RSSFEEDPATH = "./rssfeedlist.json";
		var medialist = JSON.parse(require("fs").readFileSync(RSSFEEDPATH, 'utf8'));

		for(var media in medialist){
			var feedlist = medialist[media];
			for(var j in feedlist){
				var feed = feedlist[j];
				var curDate = new Date();
				var today = 0;

				curDate = curDate.toString();
				today = curDate.substring(0, 15);

				request.get(feed)
					.on('error', function (error) {
						console.log("GET//%s : %s", media, feed);
						console.error(error);
					})
					.pipe(new FeedParser())
					.on('error', function (error) {
						console.error(error);
						console.log("PIPE//%s : %s", media, feed);
					})
					.on('meta', function (meta) {
						console.log('beg ===== %s =====', meta.title);
					})
					.on('article', function (article) {
						var aDate = article.date;
						var articleDate = 0;

						aDate = aDate.toString();
						articleDate = aDate.substring(0, 15);
						
						if( today != articleDate) return;
						article.media = media;

						self.getContent(article, function (result) {
							var Article = new Model(result);
							Article.save(function (err){
								if(err) console.err('dberr')
							});
						});
					})
					// .on('readable', function () {
					// 	var stream = this, item;
					// 	while (item = stream.read()) {
					// 		console.log('>>article', item)
					// 		console.log('>>Got article: %s', item.title || item.description );
					// 		console.log('>>link %s', item.link)
					// 	}
					// })
					.on('end', function () {
						console.log('end ===== %s =====', feed)
					});
			}
		}
	},
	getContent : function (article, callback) {
		var fs = require("fs");


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


		// var Boilerpipe = require('boilerpipe');
		// var boilerpipe = new Boilerpipe({
		// 	extractor: Boilerpipe.Extractor.ArticleSentences,
		// 	url: article.link
		// });
		return article.description;
		// boilerpipe.getText(function(err, text) {
		// 	var result = {
		// 		"title" : article.title,
		// 		"author" : article.author,
		// 		"date" : article.date,
		// 		"link" : article.link,
		// 		"media" : article.media,
		// 		"text" : text || article.description
		// 	}

		// 	// var resultDB = new Model(result);
		// 	// resultDB.save(function (err) {
		// 	// 	if(err) console.err('dberr')
		// 	// });

		// 	return result;

		// });
	},
	getPolarity : function (argument) {
		var sentiment = require('sentiment');

		sentiment('Cats are stupid.', function (err, result) {
			console.dir(result);    // Score: -2, Comparative: -0.666
		});
	},
	getKeywords : function (argument) {
		// body...
	}
}