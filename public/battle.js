var battle = {
	match: undefined,
	width: undefined,
	height: undefined,
	// TODO: Remove magic numbers;
	screen_width: 256,
	screen_height: 192,
    time_limit: undefined,
    time: undefined,
    delay: undefined,
	center: undefined,
	background: undefined,
	fighter_1: undefined,
	fighter_2: undefined,
	animation_1: {
		state: undefined,
		frames: undefined
	},
	animation_2: {
		state: undefined,
		frames: undefined
	},
	setup: function (update_package){
		client.display.canvas.width   = update_package.screen_width;
		client.display.canvas.height  = update_package.screen_height;
		client.display.context.width  = update_package.screen_width;
		client.display.context.height = update_package.screen_height;
		for(var key in update_package){
			if(typeof this[key] === 'function'){
				continue; 
			} else if(key in this){
				this[key] = update_package[key];
			}
		}
	},
	dispose: function (){
		this.match = null;
		/* Fighter_1 and _2 are JSON models sent by the server.
		 * They should be incapable of circular references,
		 * unless they are set on the client. Don't do that.
		this.fighter_1.dispose();
		this.fighter_2.dispose();
		*/
	},
	update: function (update_package){
		if(update_package.action == 'end'){
			client.stage = this.match;
			this.match.update({
				action: 'resume'
			});
			this.dispose();
		}
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
		}
	},
	command: function (command){
		client.networking.send_message(command);
	},
	draw: function (canvas, context){
		// Draw Background
        var background_image = client.resource_library.resource("test").image;
        if(background_image){
            context.drawImage(background_image, -(this.center-(this.screen_width/2)), 0);
        }
		// Draw Hud
		//   - Draw Portraits
		var portrait_rsc = client.resource_library.resource(this.fighter_1.model_id);
		var portrait_state = portrait_rsc.states['portrait'];
		var portrait_offset_x = 8;
		var portrait_offset_y = 4;
		var slice_width = portrait_state.width || portrait_rsc.width;
		var slice_height = portrait_state.height || portrait_rsc.height;
		var slice_x = portrait_state.x * slice_width;
		var slice_y = portrait_state.y * slice_height;
		context.drawImage(portrait_rsc.image,
			slice_x, slice_y, slice_width, slice_height,
			portrait_offset_x, portrait_offset_y, slice_width, slice_height
		);
		portrait_rsc = client.resource_library.resource(this.fighter_2.model_id);
		portrait_state = portrait_rsc.states['portrait'];
		portrait_offset_x = this.screen_width - portrait_offset_x - slice_width;
		slice_width = portrait_state.width || portrait_rsc.width;
		slice_height = portrait_state.height || portrait_rsc.height;
		slice_x = portrait_rsc.image_flip.width - ((portrait_state.x * slice_width)+slice_width);
		slice_y = portrait_state.y * slice_height;
		context.drawImage(portrait_rsc.image_flip,
			slice_x, slice_y, slice_width, slice_height,
			portrait_offset_x, portrait_offset_y, slice_width, slice_height
		);
		//   - Draw Bars
		var bar_offset_x = 31;
		var watch_width = 32;
		var bar_width = (this.screen_width/2) - (bar_offset_x + watch_width/2);
		var health_percent = Math.max(0, Math.min(1, this.fighter_1.health));
		context.fillStyle = 'black';
		context.fillRect(bar_offset_x,  8, bar_width, 1);
		context.fillRect(bar_offset_x,  23, bar_width, 1);
		context.fillStyle = 'white';
		context.fillRect(bar_offset_x,  9, bar_width, 14);
		context.fillStyle = 'red';
		context.fillRect(bar_offset_x, 10, bar_width, 12);
		context.fillStyle = 'yellow';
		context.fillRect(bar_offset_x, 10, Math.floor(bar_width*health_percent), 12);
		context.fillStyle = 'black';
		health_percent = Math.max(0, Math.min(1, this.fighter_2.health));
		bar_offset_x = (this.screen_width+watch_width)/2;
		context.fillRect(bar_offset_x,  8, bar_width, 1);
		context.fillRect(bar_offset_x,  23, bar_width, 1);
		context.fillStyle = 'white';
		context.fillRect(bar_offset_x,  9, bar_width, 14);
		context.fillStyle = 'red';
		context.fillRect(bar_offset_x, 10, bar_width, 12);
		context.fillStyle = 'yellow';
		var bar_fill = bar_width*health_percent;
		var red_gap = bar_width - bar_fill;
		context.fillRect(Math.ceil(bar_offset_x+red_gap), 10, Math.floor(bar_width*health_percent), 12);
		//   - Draw Watch
		var watch_rsc = client.resource_library.resource('watch1');
		var watch_state = watch_rsc.states['face'];
		slice_width = watch_state.width || watch_rsc.width;
		slice_height = watch_state.height || watch_rsc.height;
		slice_x = watch_state.x * slice_width;
		slice_y = watch_state.y * slice_height;
        var watch_offset_x = (this.screen_width-watch_width)/2;
        var watch_offset_y = 4;
		context.drawImage(watch_rsc.image,
			slice_x, slice_y, slice_width, slice_height,
			watch_offset_x, watch_offset_y, slice_width, slice_height
		);
		//   - Draw time
        var seconds_passed = Math.floor((this.time/1000) * this.delay);
        var seconds_left = Math.max(0, this.time_limit - seconds_passed);
        var minits = Math.floor(seconds_left/60);
        var seconds = seconds_left%60;
        var tens = Math.floor(seconds/10);
        var ones = seconds%10;
        var digit_state = watch_rsc.states[minits.toString()];
		slice_width = digit_state.width || watch_rsc.width;
		slice_height = digit_state.height || watch_rsc.height;
		slice_x = digit_state.x * slice_width;
		slice_y = digit_state.y * slice_height;
        context.drawImage(watch_rsc.image,
            slice_x, slice_y, slice_width, slice_height,
            watch_offset_x+3, watch_offset_y+5, slice_width, slice_height
        );
        digit_state = watch_rsc.states[tens.toString()];
		slice_x = digit_state.x * slice_width;
		slice_y = digit_state.y * slice_height;
        context.drawImage(watch_rsc.image,
            slice_x, slice_y, slice_width, slice_height,
            watch_offset_x+3+4+7, watch_offset_y+5, slice_width, slice_height
        );
        digit_state = watch_rsc.states[ones.toString()];
		slice_x = digit_state.x * slice_width;
		slice_y = digit_state.y * slice_height;
        context.drawImage(watch_rsc.image,
            slice_x, slice_y, slice_width, slice_height,
            watch_offset_x+3+4+14, watch_offset_y+5, slice_width, slice_height
        );
		// Draw Fighters
		this.draw_fighter(this.fighter_1, this.animation_1, context);
		this.draw_fighter(this.fighter_2, this.animation_2, context);
	},
	draw_fighter: function (fighter_model, animation_info, context){
		// TODO: Remove magic numbers;
		var floor_elevation = 25
		var model_id = fighter_model.model_id;
		var sheet = client.resource_library.resource(model_id);
		var state = sheet.states[fighter_model.state];
		if(state != animation_info.state){
			animation_info.state = state;
			animation_info.frame = 1;
		}
		if(!state){ console.log('Display state "'+state+'" does not exist.'); return;}
		var display_image = sheet.image;
		var slice_x;
		var slice_y;
		var slice_width = state.width || sheet.width;
		var slice_height = state.height || sheet.height;
		var state_offset_x = state.x_offset || 0;
		var state_offset_y = state.y_offset || 0;
		if(fighter_model.direction == DM.EAST){
			state_offset_x *= -1;
		}
		var screen_x = (this.screen_width/2 - this.center) + fighter_model.x - (sheet.width/2) - state_offset_x;
		var screen_y = (this.screen_height-floor_elevation)-(fighter_model.y+slice_height) - state_offset_y;
		var animation = state.animation || 0;
		var animation_offset = 0;
		// TODO: Magic number - default animation delay;
		var animation_delay = state.animation_delay || sheet.animation_delay || 1;
		if(animation > 0){
			if(!(client.time % animation_delay)){
				animation_info.frame++;
			}
			if(animation_info.frame > animation){
				animation_info.frame = 1;
			}
			animation_offset = animation_info.frame-1;
		} else if(animation < 0){
			if(!(client.time % animation_delay)){
				animation_info.frame++;
			}
			if(animation_info.frame == -1){
				animation_info.frame = 1;
			} else if(animation_info.frame > Math.abs(animation)){
				animation_info.frame = animation + 1;
			}
			animation_offset = Math.abs(animation_info.frame) - 1;
		}
		if(state.width){
			slice_x = (state.x+animation_offset) * state.width;
		} else{
			slice_x = (state.x+animation_offset) * sheet.width;
		}
		if(state.height){
			slice_y = state.y * state.height;
		} else{
			slice_y = state.y * sheet.height;
		}
		if(fighter_model.direction == DM.WEST){
			display_image = sheet.image_flip;
			slice_x = display_image.width - (slice_x + slice_width);
			screen_x -= slice_width-sheet.width;
		}
		context.drawImage(
			display_image,
			Math.floor(slice_x),
			Math.floor(slice_y),
			Math.floor(slice_width),
			Math.floor(slice_height),
			Math.floor(screen_x),
			Math.floor(screen_y),
			Math.floor(slice_width),
			Math.floor(slice_height)
		);
	}
}