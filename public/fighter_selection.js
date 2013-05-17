var fighter_selection = {
	position: 0,
	wait_time: 0,
	selection: null,
	selectable_models: [
		'sean',
		'alea',
		'sean',
		'sean',
		'sean'
	],
	setup: function (configuration){
		
	},
	update: function (update_package){
		if(update_package.id){
			console.log('updatre')
			client.stage_change(match, update_package)
		}
	},
	command: function (command){
		if(command.key_up){ return}
		if(!this.selection){
			switch(command.key_down){
				case DM.WEST:
				case DM.NORTH: {
					this.position--;
					if(this.position < 0){
						this.position = this.selectable_models.length-1;
					}
					break;
				}
				case DM.EAST:
				case DM.SOUTH: {
					this.position++;
					if(this.position >= this.selectable_models.length){
						this.position = 0;
					}
					break;
				}
				case DM.PRIMARY: {
					var character_model = this.selectable_models[this.position];
					this.selection = character_model;
					client.networking.send_message({'temp': character_model});
				}
			}
		} else{
			
		}
	},
	draw: function (canvas, context){
		// Draw Background
		var background_rsc_id = 'selection_background1';
		if(this.selection){
			background_rsc_id = 'selection_background2';
		}
		var background = client.resource_library.resource(background_rsc_id);
		context.drawImage(background.image, 0, 0);
		// Draw Cursor
		var selection_sheet = client.resource_library.resource('selection_box');
		var state = selection_sheet.states['box'];
		var animation_frame = 0;
		var animation_delay;
		if(state.animation){
			animation_delay = state.animation_delay || selection_sheet.animation_delay || 1;
			animation_frame = Math.floor(client.time/animation_delay) % state.animation;
		}
		var grid_offset_x = 103-2;
		var grid_offset_y = 84-2;
		grid_offset_x += this.position*28;
		var slice_width = state.width || selection_sheet.width;
		var slice_height = state.height || selection_sheet.height;
		var slice_x = (state.x+animation_frame) * slice_width;
		var slice_y = state.y * slice_height;
		if(!this.selection){
			context.drawImage(selection_sheet.image,
				slice_x, slice_y, slice_width, slice_height,
				grid_offset_x, grid_offset_y, slice_width, slice_height
			);
		}
		// Draw Character Preview
		// TODO: Remove magic numbers;
		var preview_offset_x = 52;
		var preview_offset_y = 145;
		var model_id = this.selectable_models[this.position];
		var preview_sheet = client.resource_library.resource(model_id);
		var draw_state = 'stand';
		if(this.selection){
			draw_state = 'victory';
		}
		var preview_state = preview_sheet.states[draw_state];
		slice_width = preview_state.width || preview_sheet.width;
		slice_height = preview_state.height || preview_sheet.height;
		var state_offset = preview_state.x_offset || 0;
		screen_x = preview_offset_x - (preview_sheet.width/2) - state_offset;
		screen_y = preview_offset_y - slice_height;
		animation_frame = 0;
		if(preview_state.animation){
			animation_delay = preview_state.animation_delay || preview_sheet.animation_delay || 1;
			if(preview_state.animation > 0){
				animation_frame = Math.floor(client.time/animation_delay) % preview_state.animation;
			} else{
				var half_mod = Math.floor(client.time/animation_delay) % ((Math.abs(preview_state.animation)*2)-2);
				if(half_mod < Math.abs(preview_state.animation)){
					animation_frame = half_mod;
				} else{
					animation_frame = Math.abs(preview_state.animation*2) - (half_mod+2)
				}
			}
		}
		// TODO: Magic number - default animation delay;
		if(preview_state.width){
			slice_x = (preview_state.x+animation_frame) * preview_state.width;
		} else{
			slice_x = (preview_state.x+animation_frame) * preview_sheet.width;
		}
		if(preview_state.height){
			slice_y = preview_state.y * preview_state.height;
		} else{
			slice_y = preview_state.y * preview_sheet.height;
		}
		context.drawImage(
			preview_sheet.image,
			Math.floor(slice_x),
			Math.floor(slice_y),
			Math.floor(slice_width),
			Math.floor(slice_height),
			Math.floor(screen_x),
			Math.floor(screen_y),
			Math.floor(slice_width),
			Math.floor(slice_height)
		);
	},
	wait_time: function (){
		
	}
};