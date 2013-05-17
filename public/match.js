var match = {
	id: undefined,
	battle: undefined,
	setup: function (update_package){
		for(var key in update_package){
			if(typeof this[key] === 'function'){
				continue; 
			} else if(key in this){
				this[key] = update_package[key];
			}
		}
	},
	update: function (update_package){
		switch(update_package.action){
			case 'start': {
				client.stage_change(battle, update_package);
				this.battle = client.stage;
				this.battle.match = this;
				break;
			}
			case 'resume': {
				console.log('Resuming')
				client.stage = this;
				break;
			}
			case 'end': {
				setTimeout(function (){
					client.stage_change(fighter_selection)
				}, 4000)
				break;
			}
		}/*
		for(var key in update_package){
			if(typeof this[key] === 'function'){
				continue; 
			} else if(typeof this[key] === 'object'){ // Caution: typeof(null) evaluates to 'object';
				var property = this[key];
				var value = update_package[key];
				for(var sub_key in value){
					property[sub_key] = value[sub_key];
				}
			} else if(key in this){
				this[key] = update_package[key];
			}
		}*/
	},
	command: function (command){
		//client.networking.send_message(command);
	},
	draw: function (canvas, context){
	},
}