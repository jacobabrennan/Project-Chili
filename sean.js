module.exports = (function (){
	var DM = require('./dm.js');
	var fighter = require('./fighter.js');
	var sequence = require('./sequence.js');
	var sean = Object.create(fighter, {
		model_id: {value: 'sean'},
		name: {value: "Sean"},
		width: {value: 28},
		standing_height: {value: 59},
		speed: {value: 4},
		jump_speed: {value: 13},
		grav: {value: -2.5},
		max_health: {value: 100},
		low_height: {value: 40},
		icon2: {value: 'sean2.dmi'},
		low_punch: {value: Object.create(fighter.low_punch, {
			parent: {value: fighter.low_punch},
			stored_x: {value: 36},
			stored_y: {value: 28},
			potency: {value: 5}
		})},
		hi_punch: {value: Object.create(fighter.hi_punch, {
			parent: {value: fighter.hi_punch},
			stored_x: {value: 43},
			stored_y: {value: 45},
			potency: {value: 7},
			behavior: {value: function (state,press){
				if(this.time <=3 && state & DM.NORTH){
					//this.fighter.x_vel += DM.sign(this.fighter.direction)*12;
					//this.fighter.y_vel += 30;
					this.sequence("uppercut");
					return;
				}
				sean.hi_punch.parent.behavior.call(this, state, press);
			}}
		})},
		jump_punch: {value: Object.create(fighter.jump_punch, {
			parent: {value: fighter.jump_punch},
			stored_x: {value: 28},
			stored_y: {value: 36}
		})},
		low_kick: {value: Object.create(fighter.low_kick, {
			parent: {value: fighter.low_kick},
			potency: {value: 3},
			stored_x: {value: 42},
			stored_y: {value: 8}
		})},
		hi_kick: {value: Object.create(fighter.hi_kick, {
			parent: {value: fighter.hi_kick},
			potency: {value: 4},
			stored_x: {value: 43},
			stored_y: {value: 51}
		})},
		jump_kick: {value: Object.create(fighter.jump_kick, {
			parent: {value: fighter.jump_kick},
			potency: {value: 2},
			stored_x: {value: 44},
			stored_y: {value: 24}
		})},
		uppercut: {value: Object.create(sequence, {
			parent: {value: sequence},
			hostile: {
				value: DM.BREAKING,
				writable: true
			},
			initial_state: {value: "uppercut-prep"},
			potency: {value: 6},
			/* Keep these values in case I need to know where the fist is in the image.
			attack_x: {value: 16},
			attack_y: {value: 89},
			*/
			behavior: {value: function (state, press){
				if(this.time < 3){
				} else if(this.time == 3){
					this.fighter.x_vel = 5*DM.sign(this.fighter.direction);
					this.fighter.icon_state = "uppercut";
					this.fighter.y_vel = 18;
					this.attack_x = 24;
					this.attack_y = 48;
				} else if(this.time <= 8){
					this.attack_x = Math.round(48-32*((this.time-3)/5))
					this.attack_y = Math.round(48+42*((this.time-3)/5))
				} else if(this.time > 13){
					this.sequence("jump")
					return
				}
				sean.uppercut.parent.behavior.call(this, state, press);
			}}
		})},
		ai: {value: {
			behavior: function (fighter){
				
			}
		}}
	});
	return sean;
})();