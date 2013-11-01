
/*
 * GET home page.
 */


var crawler = require("../webcrawler.js")

exports.index = function(req, res){
  res.render('index', { title: 'LOVELOVE_NEWSCLUSTERING_SYSTEM' });
};

exports.getfile = function(req, res){
	var data = require("fs").readFileSync(req.query.filepath, 'utf8');
	res.json(data);
};

exports.getdata = function (req, res) {
	var query = (req.query.dbquery == undefined) ? {} : JSON.parse(req.query.dbquery);
	console.dir(query)
	var data = Model.find(query, function(err,docs) {
		if(err) console.err(err);
		res.json(docs);
	});
	/*
		$.getJSON("getdata?dbquery={"key":"value"});
		EXAMPLE URL
		http://localhost:3000/getdata?dbquery={%22title%22:%22Getting%20ready%20to%20retire?%20Save%20more,%20spend%20less%22}
	*/
}

