var title_screen = {
	setup: function (){
	},
	update: function (update_package){
		if(update_package.id){
			client.stage_change(battle, update_package);
		}
	},
	command: function (command){
		var key_down = command.key_down;
		if(!key_down){ return;}
		switch(key_down){
			case DM.PRIMARY: {
				client.stage_change(fighter_selection);
				break;
			}
		}
	},
	draw: function (canvas, context){
		var title_rsc = client.resource_library.resource('title1');
		context.drawImage(title_rsc.image, 0, 0);
	}
}