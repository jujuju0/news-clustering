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

						var Article = new Model({ "title" : article.title, "author" : article.author, "date" : article.date, "link" : article.link, "media" : article.media, "text" : article.description });
						Article.save(function (err){
							if(err) console.err('dberr')
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
	getContent : function (article) {
		var fs = require("fs");
		var Boilerpipe = require('boilerpipe');
		var boilerpipe = new Boilerpipe({
			extractor: Boilerpipe.Extractor.ArticleSentences,
			url: article.link
		});
		boilerpipe.getText(function(err, text) {
			var result = {
				"title" : article.title,
				"author" : article.author,
				"date" : article.date,
				"link" : article.link,
				"media" : article.media,
				"text" : text || article.description
			}

			var resultDB = new mySchema(result);
			resultDB.save(function (err) {
				if(err) console.err('dberr')
			})
			// FILE -> MONGO
			// fs.appendFile('feedresult_test.json', JSON.stringify(result), function (err) {
			// 	if (err) throw err;
			// 	console.log('end ===== %s =====\n===== %s =====', article.title, (new Date()).toString());
			// });

		});
	},
	getPolarity : function (argument) {
		// body...
	},
	getKeywords : function (argument) {
		// body...
	}
}