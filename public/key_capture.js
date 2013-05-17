client.preferences = {
	"38": DM.NORTH,
	"40": DM.SOUTH,
	"37": DM.WEST,
	"39": DM.EAST,
	"32": DM.PRIMARY,
	"90": DM.SECONDARY,
	"88": DM.TERTIARY,
	"67": DM.QUATERNARY,
}
// Dependant on client.js
client.key_capture = {
    key_state: {},
	setup: function (){
		window.onkeydown = function (e){ client.key_capture.key_press(e)};
		window.onkeyup   = function (e){ client.key_capture.key_up(e)};
	},
	key_press: function (e){
		var key_code;
		if(window.event){ key_code = e.keyCode} // IE 8 and earlier compatibility.
		else{
			key_code = e.which// | e.keyCode;
		}
		// Start key_down repeat work-around.
		if(this.key_state[key_code.toString()]){ return}
		this.key_state[key_code.toString()] = true;
			// End key_down repeat work-around.
		var command = client.preferences[key_code.toString()];
		if(command){
			client.stage.command({"key_down": command});
		}
	},
	key_up: function (e){
		var key_code;
		if(window.event){ key_code = e.keyCode} // IE 8 and earlier compatibility.
		else{
			key_code = e.which// | e.keyCode;
		}
		// Start key_down repeat work-around.
		delete this.key_state[key_code.toString()];
			// End key_down repeat work-around.
		var command = client.preferences[key_code.toString()];
		if(command){
			client.stage.command({"key_up": command});
		}
	},
	flush_keys: function (){
		client.networking.send_message({'flush_keys': true});
	}
}