module.exports = (function (){
	var DM = require('./dm.js');
	var fighter = require('./fighter.js');
	var sequence = require('./sequence.js');
	var alea = Object.create(fighter, {
		model_id: {value: 'alea'},
		name: {value: "Alea"},
		width: {value: 20},
		standing_height: {value: 59},
		speed: {value: 9},
		jump_speed: {value: 14},
		grav: {value: -2.0},
		max_health: {value: 80},
		low_height: {value: 40},
		jump: {value: Object.create(fighter.jump, {
			parent: {value: fighter.jump},
			double_jump: {
				value: true,
				writable: true
			},
			behavior: {value: function (state, press){
				if(state&DM.SOUTH && press&DM.KICK){
					this.sequence("dance")
					return;
				}
				alea.jump.parent.behavior.call(this, state, press);
			}}
		})},
		low_punch: {value: Object.create(fighter.low_punch, {
			parent: {value: fighter.low_punch},
			stored_x: {value: 45},
			stored_y: {value: 36},
			potency: {value: 4}
		})},
		hi_punch: {value: Object.create(fighter.hi_punch, {
			parent: {value: fighter.hi_punch},
			stored_x: {value: 35},
			stored_y: {value: 68},
			potency: {value: 5},
			behavior: {value: function (state,press){
				if(this.time > 8){
					this.sequence("stand");
					return;
				}
				if(this.time > 6){
					this.attack_x = 0;
					this.attack_y = 0;
					this.fighter.icon_state = "hi-kick-prep";
					this.disarm();
				}
				if(this.time > 2){
					this.attack_x = this.stored_x;
					this.attack_y = 55;
					this.fighter.icon_state = "hi-punch";
				}
				if(this.time > 4){
					//this.potency = 5;
					this.attack_y = this.stored_y;
				}
				alea.hi_punch.parent.behavior.call(this, state, press);
			}}
		})},
		dance: {value: Object.create(sequence, {
			parent: {value: sequence},
			hostile: {
				value: true,
				writable: true
			},
			initial_state: {value: "dance"},
			potency: {value: 4},
			attack_x: {value: -10},
			attack_y: {value: -40},
			hit: {
				value: 0,
				writable: true
			},
			moveable: {value: true},
			behavior: {value: function (state,press){
				this.fighter.y_vel -= this.fighter.grav/3;
				this.attack_x *= -1;
				if(!this.hostile && !this.hit){
					this.hit = true;
					this.fighter.y_vel = this.fighter.jump_speed;
					this.fighter.Y = this.fighter.opponent.height - this.fighter.y_vel;
					this.fighter.Y = this.fighter.opponent.height;
				}
				if(this.time > 12){
					this.sequence("jump");
					return;
				}
				alea.dance.parent.behavior.call(this, state, press);
			}},
		})},
		flying_kick: {value: Object.create(sequence, {
			parent: {value: sequence},
			hostile: {
				value: DM.BREAKING,
				writable: true
			},
			initial_state: {value: "flying-kick"},
			potency: {value: 6},
			attack_x: {value: 48},
			attack_y: {value: 48},
			behavior: {value: function (state, press){
				if(this.time < 3){
					this.fighter.y_vel = 15;
					this.fighter.x_vel = 9*DM.sign(this.fighter.direction);
				} else if(this.time > 8){
					this.sequence("jump");
					return;
				} else{
					//this.fighter.x_vel += 1*DM.sign(this.fighter.direction);
					//this.fighter.y_vel += 1;
				}
				alea.flying_kick.parent.behavior.call(this, state, press)
			}}
		})},
		jump_punch: {value: Object.create(fighter.jump_punch, {
			parent: {value: fighter.jump_punch},
			potency: {value: 5},
			stored_x: {value: 38},
			stored_y: {value: 48}
		})},
		low_kick: {value: Object.create(fighter.low_kick, {
			parent: {value: fighter.low_kick},
			potency: {value: 3},
			stored_x: {value: 48},
			stored_y: {value: 2},
			x_vel: {value: 13, writable: true}
		})},
		hi_kick: {value: Object.create(fighter.hi_kick, {
			parent: {value: fighter.hi_kick},
			potency: {value: 3},
			stored_x: {value: 43},
			stored_y: {value: 51},
			New: {value: function (_f, _lock){
				alea.hi_kick.parent.New.call(this, _f, _lock);
				this.fighter.x_vel += DM.sign(this.fighter.direction)*5;
			}},
			behavior: {value: function (state, press){
				if(press&DM.SOUTH){ this.storage |= DM.SOUTH;}
				if(this.time > 5 && press&DM.PUNCH && state&DM.SOUTH){
					this.fighter.x_vel += DM.sign(this.fighter.direction)*12;
					this.fighter.y_vel += 10;
					this.sequence("spin_punch");
					return;
				}
				if(this.time < 7 && press&DM.NORTH && this.storage&DM.SOUTH){
					this.sequence("flying_kick")
					return;
				}
				alea.hi_kick.parent.behavior.call(this, state, press);
			}}
		})},
		jump_kick: {value: Object.create(fighter.jump_kick, {
			parent: {value: fighter.jump_kick},
			potency: {value: 3},
			stored_x: {value: 45},
			stored_y: {value: 18}
		})}
	});
	alea.spin_punch = Object.create(alea.hi_punch, {
		parent: {value: alea.hi_punch},
		hostile: {
			value: DM.BREAKING,
			writable: true
		}
	});
	return alea;
})();