var client = {
	time: 0,
	delay: 1000/30,
	stage: undefined,
    setup: function (configuration){
        console.log("Starting: "+JSON.stringify(configuration));
		this.display.setup(configuration);
        this.resource_library.setup(configuration);
		// TODO: setup key_capture with values saved on the server per player.
        this.key_capture.setup();
		this.networking.setup(configuration);
		this.stage_change(title_screen);
		this.iterate();
    },
	stage_change: function (stage_prototype, configuration){
		this.key_capture.flush_keys()
		this.stage = Object.create(stage_prototype);
		this.stage.setup(configuration);
	},
	iterate: function (){
		// Note: 'this' cannot be used, because of the setTimeout call.
		client.time++;
		client.display.draw();
		setTimeout(client.iterate, client.delay);
	}
};