cluster =  function() {
	this.module = {
		crawler: null
	}
};

cluster.prototype = {
	init: function() {
		this.module.crawler = cluster.webcrawler;
		this.module.crawler.init();
		console.log('MAKEcrawler',this.module.crawler);
		return this.module.crawler;
	}
}