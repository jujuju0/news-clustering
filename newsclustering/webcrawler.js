/*
	author : Miae Kim ( http://facebook.com/sweet.miae.kim )
*/

var mongoose = require('mongoose');
var db = mongoose.connection;
var mySchema = mongoose.Schema({
	name		: String,
	title		: { type: String, index: true },
	author		: String,
	date		: Date, //{ type: Date, default: Date.now },
	link		: String,
	media		: String,

	text		: String,
	keywords	: [String],
	score		: Number,
	polarity	: Number,

	gottext		: { type: Boolean, default: false },
	gotpol		: { type: Boolean, default: false },
	gotkey		: { type: Boolean, default: false },
	gotScore	: { type: Boolean, default: false }
});

var DBname = "articles";
var Model = mongoose.model('result', mySchema);
mongoose.connect('localhost', DBname);

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
		var medialist = JSON.parse(this.getfile(RSSFEEDPATH));

		for(var media in medialist){
			var feedlist = medialist[media];
			for(var j in feedlist){
				var feed = feedlist[j];
				var articlecnt = 0;
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
						if( ++articlecnt > 10 ) return;
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
		var Kitten = mongoose.model('Kitten', kittySchema);
		var fluffy = new Kitten({ name: 'fluffy' });
		console.log("fluffy에 저장된 내용:"+ fluffy.name);
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
	}
}