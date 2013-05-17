client.display = {
	canvas: undefined,
	context: undefined,
	setup: function (configuration){
		this.canvas = document.getElementById(configuration.id);
		this.canvas.width = DM.default_screen_width;
		this.canvas.height = DM.default_screen_height;
		this.context = this.canvas.getContext('2d');
		// TODO: Draw simple 'loading' message;
	},
	draw: function (){
		if(client.stage.draw){
			client.stage.draw(this.canvas, this.context)
		}
	}
}