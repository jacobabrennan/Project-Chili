// Dependant on client.js
client.resource = function (identifier){
	return this.resource_library.resource(identifier);
}
client.resource_library = {
	resource_load_ready: false,
	resource_loading_ids: [],
	resource: function (identifier){
		return this.library[identifier];
	},
	loaded_images: {},
	library: {
		/* Known Issues:
		 * 		Mirrored versions of sprite_sheets will not be created for
		 * 		resources which use the same url as previously loaded resources.
		 */
		// I - Graphics
		// I.a - Interface
		'title1': {resource_type: 'image', url: 'title.png'},
		'selection_background1': {resource_type: 'image', url: 'selection.png'},
		'selection_background2': {resource_type: 'image', url: 'selection_wait.png'},
		'selection_box': {
			resource_type: 'sprite_sheet',
			url: 'selection_box.png',
			width: 28,
			height: 28,
			animation_delay: 1,
			states: {
				'box': { animation: 4, x: 0, y: 0}
			}
		},
		'watch1': {
			resource_type: 'sprite_sheet',
			url: 'watch.png',
			width: 7,
			height: 14,
			states: {
				'face': {width: 32, height: 24, x: 0, y: 0},
                '0' : {x: 5, y: 0},
                '1' : {x: 6, y: 0},
                '2' : {x: 7, y: 0},
                '3' : {x: 8, y: 0},
                '4' : {x: 9, y: 0},
                '5' : {x: 5, y: 1},
                '6' : {x: 6, y: 1},
                '7' : {x: 7, y: 1},
                '8' : {x: 8, y: 1},
                '9' : {x: 9, y: 1},
                ':' : {x: 10, y: 0},
			}
		},
		// I.b - Fighters
		'sean': {
			resource_type: 'sprite_sheet',
			mirror: true,
			url: 'sean.png',
			width: 48,
			height: 64,
			animation_delay: 6,
			states: {
				'portrait': { width: 24, height: 24, x: 28, y: 4},
				'stand': { animation: -3, x: 0, y: 0},
				'walk': { animation: -3, x: 3, y: 0},
				'jump_1': { x: 6, y: 0},
				'jump_2': { x: 7, y: 0},
				'jump_2': { x: 7, y: 0},
				'hi-guard': { x: 8, y: 0},
				'hi-hurt': { x: 9, y: 0},
				'uppercut-prep': { x: 10, y: 0},
				'jump_2': { x: 7, y: 0},
				'hi-punch-prep': { x: 0, y: 1},
				'hi-kick-prep': { x: 1, y: 1},
				'hi-punch': { width: 96, x: 1, y: 1},
				'hi-kick': { width: 96, x: 2, y: 1},
				'jump-punch': { width: 96, x: 3, y: 1},
				'jump-kick': { width: 96, x: 4, y: 1},
				'jump-hurt': { width: 96, x: 5, y: 1},
				'low': { height: 48, x: 12, y: 1},
				'low-guard': { height: 48, x: 13, y: 1},
				'low-hurt': { height: 48, x: 14, y: 1},
				'low-kick-prep': { height: 48, x: 15, y: 1},
				'low-punch-prep': { height: 48, x: 11, y: 0},
				'low-punch': { width: 96, height: 48, x: 6, y: 0},
				'low-kick': { width: 96, height: 48, x: 7, y: 0},
				'victory': { height: 96, x: 16, y: 0},
				'dead': { x_offset: -24, y_offset: -8, width: 96, height: 32, x: 6, y: 3},
				'uppercut': { height: 96, x: 17, y: 0}
			}
		},
		'alea': {
			resource_type: 'sprite_sheet',
			mirror: true,
			url: 'alea.png',
			width: 48,
			height: 64,
			animation_delay: 10,
			states: {
				'portrait': { width: 24, height: 24, x: 28, y: 4},
				'stand': { animation: 3, x: 0, y: 0},
				'walk': { animation: -3, x: 3, y: 0},
				'jump_1': { x: 6, y: 0},
				'jump_2': { x: 7, y: 0},
				'jump_2': { x: 7, y: 0},
				'hi-guard': { x: 8, y: 0},
				'hi-hurt': { x: 9, y: 0},
				'uppercut-prep': { x: 10, y: 0},
				'jump_2': { x: 7, y: 0},
				'hi-punch-prep': { x: 0, y: 1},
				'hi-kick-prep': { x: 1, y: 1},
				'hi-punch': { width: 96, height: 96, x: 9, y: 0},
				'hi-kick': { width: 96, x: 2, y: 1},
				'jump-punch': { width: 96, x: 3, y: 1},
				'jump-kick': { width: 96, x: 4, y: 1},
				'jump-hurt': { width: 96, x: 5, y: 1},
				'low': { height: 48, x: 12, y: 1},
				'low-guard': { height: 48, x: 13, y: 1},
				'low-hurt': { height: 48, x: 14, y: 1},
				'low-kick-prep': { height: 48, x: 15, y: 1},
				'low-punch-prep': { height: 48, x: 11, y: 0},
				'low-punch': { width: 96, height: 48, x: 6, y: 0},
				'low-kick': { width: 96, height: 48, x: 7, y: 0},
				'victory': { animation: 2, height: 96, x: 16, y: 0},
				'dance': { animation: 2, height: 96, x: 16, y: 0},
				'dead': { x_offset: -24, y_offset: -8, width: 96, height: 32, x: 6, y: 3},
				'flying-kick': { width: 96, x: 1, y: 1}
			}
		},
		// I.c - Backgrounds
		"test": {resource_type: 'image', url: 'background.png'},
	},
	setup: function (configuration, callback){
		console.log("Setting up resources");
		console.log("TODO:: Fix resource on noted line.");
		var setup_canvas = document.createElement('canvas');
		var setup_context = setup_canvas.getContext('2d');
		for(var key in this.library){
			var resource = this.library[key];
			if(!(resource.url in this.loaded_images)){
				var new_image = new Image();
				this.resource_loading_ids.push(resource.url);
				var load_call = (function (index_resource, index_image){
					return function (){
						if(index_resource.mirror){
							setup_canvas.width = parseInt(index_image.width);
							setup_canvas.height = parseInt(index_image.height);
							setup_context.clearRect(0, 0, setup_context.width, setup_context.height);
							setup_context.scale(-1, 1);
							setup_context.drawImage(index_image, -index_image.width, 0);
							index_resource.image_flip = new Image();
							index_resource.image_flip.src = setup_canvas.toDataURL();
						}
						client.resource_library.resource_loading_ids.shift();
							// Array.shift: Removes the first element from an array and returns that element.
						if(client.resource_library.resource_load_ready){
							if(!client.resource_library.resource_loading_ids.length){
								console.log("Finished loading resource library.")
								if(callback){
									callback();
								}
							}
						}
					};
				})(resource, new_image);
				new_image.addEventListener("load", load_call, false)
				new_image.src = resource.url;
				this.loaded_images[resource.url] = new_image;
			}
			resource.image = this.loaded_images[resource.url];
		}
		this.resource_load_ready = true;
		if(!this.resource_loading_ids.length){
			console.log("Finished loading resource library.")
            if(callback){
                callback();
            }
		}
	}
}