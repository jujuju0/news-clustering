
/*
 * GET home page.
 */


var crawler = require("../webcrawler.js")

exports.index = function(req, res){
  res.render('index', { title: 'LOVELOVE_NEWSCLUSTERING_SYSTEM' });
};

exports.getfile = function(req, res){
	var data = crawler.getfile(req.query.filepath);
	res.json(data);
};

