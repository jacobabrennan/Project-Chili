module.exports = (function (){
	var DM = require('./dm.js');
	var fighter = require('./fighter.js');
	var sequence = require('./sequence');
	var client = require('./client.js');
    var match = require('./match.js');
	var battle = require('./battle.js');
	var game = {
		io: undefined, // TODO: temp
		setup: function (configuration){
			this.io = configuration.io;
			this.io.sockets.on('connection', function (socket) {
				var new_client = Object.create(client);
				new_client.setup(socket);
			});
		},
		create_match: function (fighter_model_1, fighter_model_2, controller1, controller2){
			var new_match = Object.create(match);
            new_match.setup(fighter_model_1, fighter_model_2, controller1, controller2);
			new_match.start();
		}
	};
	return game;
})();