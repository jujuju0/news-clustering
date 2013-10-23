/*
	author : Miae Kim ( http://facebook.com/sweet.miae.kim )
*/

module.exports = {
	getfile : function(filepath){
		var fs = require("fs");
		var _file = fs.readFileSync(filepath,'utf8');
		return _file;
	},
	getRSS : function(){
		var self = this;
		var FeedParser = require('feedparser');
		var request = require('request');
		var RSSFEEDPATH = "./rssfeedlist.json";
		var feedlist = eval(this.getfile(RSSFEEDPATH));

		if( !Array.isArray(feedlist)) {
			console.log('THIS IS NOT FEED ERROR')
			return;
		}

		// BEFORE
		//Feedlist
		//	feed

		// AFTER
		//Object
		//	Media
		//		feed

		for( i in feedlist) {
			var feed = feedlist[i];
			var data;
			var articlecnt = 0;
			request.get(feed)
				.on('error', function (error) {
					console.error(error);
				})
				.pipe(new FeedParser())
				.on('error', function (error) {
					console.error(error);
				})
				.on('meta', function (meta) {
					console.log('beg ===== %s =====', meta.title);
				})
				.on('article', function (article) {
					articlecnt++;
					if( articlecnt > 10 ) return;
					self.getContent(article, feed);
				})
				// .on('readable', function () {
				// 	var stream = this, item;
				// 	while (item = stream.read()) {
				// 		console.log('>>article', item)
				// 		console.log('>>Got article: %s', item.title || item.description );
				// 		console.log('>>link %s', item.link)
				// 	}
				// })
				// .on('end', function () {
				// 	console.log('end ===== %s =====', feed)
				// });
		}	
	},
	getContent : function (article, feed) {
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
				"media" : "",
				"text" : text || article.description
				// "polarity" : integer
			}

			// FILE -> MONGO
			fs.appendFile('feedresult_test.json', JSON.stringify(result), function (err) {
				if (err) throw err;
				console.log('end ===== %s =====\n===== %s =====', article.title, (new Date()).toString());
			});
		});
	},
	//==================================================================================//
	//===== The Codes below this line are just test codes, it is not needed to run =====//
	//==================================================================================//
	boilerpipetest: function () {
		var Boilerpipe = require('boilerpipe');
		var boilerpipe = new Boilerpipe({
			extractor: Boilerpipe.Extractor.ArticleSentences,
			url: 'http://www.nytimes.com/2013/10/12/us/politics/budget-and-debt-limit-debate.html?hp'
			// url: 'http://rss.cnn.com/~r/rss/cnn_topstories/~3/ZIKpKrf_-to/index.html'
		});
		boilerpipe.getText(function(err, text) {
			console.log('text',text);
		});
	},
	sentimentTest: function (argument) {
		var sentiment = require('sentiment');

		sentiment('Cats are stupid.', function (err, result) {
			console.dir(result);    // Score: -2, Comparative: -0.666
		});

	},
	TFIDFTest : function() {

	},
	mongoTest : function (argument) {
		// var mongoClient = require('mongodb').mongoClient;
		// var url = 'mongodb://localhost'
		// var mongo = require('mongodb');

		// var db = new mongo.Db('test', new mongo.Server('localhost',22892, {}), {});

		// db.open(function(){});

		// db.collection('docs', function(err,collection){
  // 	  		doc = {"foo":"bar"};
  //  		 	collection.insert(doc, function(){});
		// });
		var mongoose = require('mongoose');
		var db = mongoose.connection;

		var kittySchema = mongoose.Schema({
				"name" : String,
				"title" : String,
				"author" : String,
				"date" : String,
				"link" : String,
				"media" : String,
				"text" : String
		});
		// var Kitten = mongoose.model('Kitten', kittySchema)
		// var silence = new Kitten({ name: 'Silence' })

		kittySchema.methods.speak = function () {
			var greeting = this.name
			? "Meow name is " + this.name
			: "I don't have a name"
			console.log(greeting);
		}
		var Kitten = mongoose.model('Kitten', kittySchema)
		var fluffy = new Kitten({ name: 'fluffy' });
		fluffy.speak();
		fluffy.save(function (err, fluffy) {
			if (err) // TODO handle the error
			fluffy.speak();
		});
		Kitten.find(function (err, kittens) {
			if (err) // TODO handle err
			console.log(kittens)
		});
		mongoose.connect('mongodb://localhost/my_database');
	},
	javaTest : function (){
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