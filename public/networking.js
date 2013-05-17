client.networking = {
	setup: function (configuration){
		this.socket = io.connect(configuration.address);
		this.socket.on('connect', function (msg) { // Note: msg, supplied by socket.io, seems to be empty.
			this.on('connection', function (conf_msg){
				client.networking.connection(conf_msg);
			});
			this.on('update', function(message){
				client.networking.recieve_message(message);
			})
		});
	},
	connection: function (configuration){
		// TODO: accept 'news' and other connection data from server.
		// Or just remove this step.
	},
	send_message: function (message_object){
		this.socket.emit('client_message', message_object);
	},
	recieve_message: function (message_object){
		if(message_object.action != 'update'){
			console.log(message_object.action)
		}
		if(client.stage.update){
			client.stage.update(message_object);
		}
	}
};