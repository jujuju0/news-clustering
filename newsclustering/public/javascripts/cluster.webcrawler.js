
cluster.webcrawler = {
	rssfeedlist : null,

	init : function() {
		this.loadrssfeedlist();
	},
	
	loadrssfeedlist : function(){
		var self = this;
		$.getJSON("/getfile?filepath=./rssfeedlist.json", function (data){
			self.rssfeedlist = data;
			console.log(self.rssfeedlist);
		});
	}
}