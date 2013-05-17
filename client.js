module.exports = (function (){
	var DM = require('./dm.js');
	var client = {
		socket: undefined,
		setup: function (socket){
            this.key_state = Object.create(this.key_state);
			this.socket = socket;
            var new_client = this;
			socket.on('client_message', function (control_message) {
				new_client.control_message(control_message);
			});
			var connection_configuration = {
			}
			socket.emit('connection', connection_configuration);
		},
		temp: function (model_id){
			// TODO: refactor this terrible hack out of here.
            // TODO: Remove this temp stuff
			var game = require('./game.js');
            if(game.waiting_model_id){
                game.create_match(game.waiting_model_id, model_id, game.waiting_client, this);
				game.waiting_model_id = undefined;
				game.waiting_client = undefined;
            } else{
                game.waiting_client = this;
                game.waiting_model_id = model_id
            }
			//game.create_battle(fighter_1, fighter_2, this, null);
		},
		update: function (update_package){
			this.socket.emit('update', update_package);
		},
		control_message: function (message){
			for(var key in message){
				switch(key){
					case 'key_up': {
						this.key_state.key_up(message[key]);
						break;
					}
					case 'key_down': {
						this.key_state.key_down(message[key]);
						break;
					}
					case 'flush_keys': {
						this.key_state.flush_keys();
						break;
					}
					case 'temp': {
						this.temp(message[key]);
					}
				}
			}
		},
		key_state: {
			key_state: 0,
			key_pressed: 0,
			old_keys: 0,
			keys_stick: 0,
			key_up: function (which){
				this.key_state &= ~which;
				this.old_keys &= ~which;
				if(which < 16){
					var opposite = DM.flip(which);
					if(opposite & this.old_keys){
						this.key_state |= opposite;
						this.old_keys &= ~opposite;
					}
				}
			},
			key_down: function (which){
				if(which < 16){
					var opposite = DM.flip(which);
					if(opposite & this.key_state){
						this.key_state &= ~opposite;
						this.old_keys |= opposite;
					}
				}
				this.key_state |= which;
				this.key_pressed |= which;
			},
			clear_keys: function (save_buttons){
				this.key_pressed = 0;
			},
			flush_keys: function (){
				this.key_state = 0;
				this.key_pressed = 0;
				this.old_keys = 0;
				this.keys_stick = 0;
			}
		}
	}
	return client;
})();