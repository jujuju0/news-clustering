
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var app = express();
var webcrawler = require('./webcrawler.js');

// mongo
/*
mongoose = require('mongoose');
var db = mongoose.connection;
mySchema = mongoose.Schema({
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

var DBpath = "mongodb://localhost:27017/articles";
Model = mongoose.model('result', mySchema);
mongoose.connect(DBpath);
*/
// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(require('less-middleware')({ src: __dirname + '/public' }));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/getfile', routes.getfile);
app.get('/getdata', routes.getdata)
// setInterval(webcrawler.getRSS() , 86400000);
// webcrawler.getRSS();
// (function () {
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
// })
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
