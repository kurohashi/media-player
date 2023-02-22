var ctrl = require("../../../controllers/songs.controller");
// The route urls presented here are going to  
module.exports = function(app){
	app.route("/songs")
		.get(ctrl.read)
		.put(ctrl.update);
}	
	

