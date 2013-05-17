module.exports = (function (){
	var DM = require('./dm.js');
	var fighter = require('./fighter.js');
	var sequence = {
		parent: undefined,
		fighter: undefined,
		initial_state: undefined,
		key_lock: undefined,
		time: 0,
		moveable: undefined,
		move_lock: undefined,
		hurting: 0,
		guarding: undefined,
		hostile: 0,
		attack_x: 0,
		attack_y: 0,
		stored_x: undefined,
		stored_y: undefined,
		y_vel: undefined,
		x_vel: undefined,
		low: undefined,
		potency: 5,
		storage: 0,
		New: function (_F,lock){
			this.fighter = _F
			// TODO: Example this istype statement.
			// Look into original .dm files for info on what key_lock was supposed to do.
			//if(istype(this.fighter.intelligence)){
			if(this.fighter.intelligence){
				this.key_lock = this.fighter.intelligence.key_state.key_state;
			}
			// del this.fighter.sequence // Make sure the former sequence object can be garbage collected.
			this.fighter.sequence = this;
			this.fighter.icon_state = this.initial_state;
			if(this.low){
				this.fighter.height = this.fighter.low_height;
			} else{
				this.fighter.height = this.fighter.standing_height;
			}
			//TODO: I don't understand this.
			/*if(!lock && this.fighter.intelligence){// && (istype(this.fighter.intelligence))){
				this.behavior(this.fighter.intelligence.key_state.key_state, this.fighter.intelligence.key_state.key_pressed);
			}*/
		},
		dispose: function (){
			this.fighter = null;
			this.parent = null;
		},
		behavior: function (state, press){
			if(this.moveable){
				if(state & DM.EAST){
					this.fighter.X += this.fighter.speed;
				}
				else if(state & DM.WEST){
					this.fighter.X -= this.fighter.speed;
				}
			}
			else if(this.move_lock){
				if(this.key_lock & DM.EAST){
					this.fighter.X += this.fighter.speed;
				}
				else if(this.key_lock & DM.WEST){
					this.fighter.X -= this.fighter.speed;
				}
			}
			// TODO: Yeah, don't know. Something about the computer.
			/*if(istype(this.fighter.intelligence)){
				this.fighter.intelligence.clear_keys();
			}*/
			var fighter2 = this.fighter.opponent;
			if(this.attack_x && this.attack_y &&(fighter2.sequence.hurting < this.hostile)){
				var pole_to = ((this.fighter.direction == DM.EAST)? 1 : -1);
				var d_x = fighter2.X - this.fighter.X;
				if((pole_to<=0 && d_x<=0) || (pole_to>=0 && d_x>=0)){
					if(Math.abs(d_x) <= fighter2.width/2+this.attack_x){
						if(fighter2.Y <= this.attack_y+this.fighter.Y){
							if(fighter2.Y+fighter2.height >= this.attack_y+this.fighter.Y){
								fighter2.hurt(this.potency, this.low, this)
								this.hostile = false;
							}
						}
					}
				}
			}
			this.time++;
		},
		sequence: function (sequence_name){
			var sequence_prototype = this.fighter[sequence_name]
			if(!sequence_prototype){
				return;
			}
			var new_sequence = Object.create(sequence_prototype);
			new_sequence.New(this.fighter);
			this.dispose();
		},
		arm: function (){
			this.attack_x = this.stored_x;
			this.attack_y = this.stored_y;
		},
		disarm: function (){
			this.attack_x = 0;
			this.attack_y = 0;
		},
		score: function (fighter, opponent){
			return 0;
		}
	}
	fighter.stand = Object.create(sequence, {
		parent: {value: sequence},
		moveable: {value: true},
		initial_state: {value: 'stand'},
		behavior: {value: function (state, press){
			if(state & DM.NORTH){
				this.sequence("jump");
				return;
			}
			if(state & DM.SOUTH){
				this.sequence("low");
				return;
			}
			if(press & DM.PUNCH){
				this.sequence("hi_punch");
				return;
			}
			if(press & DM.KICK){
				this.sequence("hi_kick");
				return;
			}
			if(!this.guarding && (state & DM.flip(this.fighter.direction))){
				this.sequence("hi_guard");
				return;
			}
			if(state & (DM.EAST|DM.WEST)){
				this.fighter.icon_state = "walk";
			}
			else{
				this.fighter.icon_state = 'stand';
			}
			fighter.stand.parent.behavior.call(this, state, press);
		}},
	});
	fighter.hi_guard = Object.create(fighter.stand, {
		parent: {value: fighter.stand},
		initial_state: {value: 'stand'},
		guarding: {value: true},
		behavior: {value: function (state, press){
			if(!(state & DM.flip(this.fighter.direction))){
				this.sequence("stand");
				return;
			}
			if(state & DM.SOUTH){
				this.sequence("low_guard");
				return;
			}
			if(this.fighter.opponent.sequence.hostile){
				this.fighter.icon_state = "hi-guard";
				return;
			}
			fighter.hi_guard.parent.behavior.call(this, state, press);
		}},
		score: {value: function (fighter, opponent){
			var result = 0;
			if(opponant.sequence.low){ result += -10;}
			if(opponent.sequence.hostile){ result += 3;}
			return result;
		}}
	});
	fighter.low_guard = Object.create(sequence, {
		parent: {value: sequence},
		initial_state: {value: "low-guard"},
		low: {value: true},
		guarding: {value: true},
		behavior: {value: function (state, press){
			if(!(state & DM.SOUTH)){
				this.sequence("hi_guard");
				return;
			}
			if(!(state & DM.flip(this.fighter.direction) && this.fighter.opponent.sequence.hostile)){
				this.sequence("low");
				return;
			}
			fighter.low_guard.parent.behavior.call(this, state, press);
		}},
		score: {value: function (fighter, opponent){
			var result = 0;
			if(!fighter.sequence.low){ result -= 10;}
			if(opponant.Y){ result += -10;}
			else if(!opponent.sequence.low){ result += 1;}
			if(opponent.sequence.hostile){ result += 3;}
			return result;
		}}
	});
	fighter.low = Object.create(sequence, {
		parent: {value: sequence},
		initial_state: {value: "low"},
		low: {value: true},
		behavior: {value: function (state, press){
			if(!(state & DM.SOUTH)){
				this.sequence("stand")
				return;
			}
			if(press & DM.PUNCH){
				this.sequence("low_punch")
				return;
			}
			if(press & DM.KICK){
				this.sequence("low_kick")
				return;
			}
			if(state & DM.flip(this.fighter.direction) && this.fighter.opponent.sequence.hostile){
				this.sequence("hi_guard")
				return;
			}
			fighter.low.parent.behavior.call(this, state, press);
		}}
	});
	fighter.jump = Object.create(sequence, {
		parent: {value: sequence},
		moveable: {value: true},
		initial_state: {value: "jump_1"},
		// New Variables:
		attacked: {
			value: true,
			writable: true
		},
		double_jump: {
			value: false,
			writable: true
		},
		// TODO: Replace this with 'setup' perhaps?
		New: {value: function (_f, _lock){
			// TODO: Do the parent?
			fighter.jump.parent.New.call(this, _f, _lock);
			if(!this.fighter.Y){
				this.fighter.y_vel = this.fighter.jump_speed;
				this.attacked = false;
			}
		}},
		behavior: {value: function (state, press){
			if(this.fighter.Y > 60){
				this.fighter.icon_state = "jump_2";
				var wall_dir = ((this.fighter.X > this.fighter.battle.center)? DM.WEST : DM.EAST);
				if(this.double_jump){
					if(Math.abs(this.fighter.X-this.fighter.battle.center)+this.fighter.width/2 >= 120){
						if(press&(DM.NORTH|wall_dir)){
							this.double_jump = false;
							this.fighter.y_vel = this.fighter.jump_speed*2/3;
							this.fighter.x_vel = this.fighter.speed*DM.sign(wall_dir)//*2;
							this.fighter.direction = wall_dir;
						}
					}
				}
			}
			if(this.fighter.Y < 60){
				this.fighter.icon_state = "jump_1";
			}
			if(state & DM.NORTH){
				this.fighter.y_vel += -this.fighter.gravity/2;
			}
			if(!this.attacked){
				if(press & DM.PUNCH){
					this.sequence("jump_punch");
					return;
				}
				if(press & DM.KICK){
					this.sequence("jump_kick");
					return;
				}
			}
			fighter.jump.parent.behavior.call(this, state, press);
		}}
	});
	fighter.low_punch = Object.create(sequence, {
		parent: {value: sequence},
		initial_state: {value: "low-punch-prep"},
		low: {value: true},
		hostile: {value: true},
		behavior: {value: function (state, press){
			if(this.time > 10){
				this.sequence("low");
				return;
			}
			if(this.time > 4){
				this.arm();
				this.fighter.icon_state = "low-punch";
			}
			fighter.low_punch.parent.behavior.call(this, state, press);
		}}
	});
	fighter.hi_punch = Object.create(sequence, {
		parent: {value: sequence},
		initial_state: {value: "hi-punch-prep"},
		hostile: {value: true},
		behavior: {value: function (state, press){
			if(this.time > 10){
				this.sequence("stand");
				return;
			}
			if(this.time > 4){
				this.arm();
				this.fighter.icon_state = "hi-punch";
			}
			fighter.hi_punch.parent.behavior.call(this, state, press);
		}}
	});
	fighter.jump_punch = Object.create(sequence, {
		parent: {value: sequence},
		initial_state: {value: "jump-punch"},
		move_lock: {value: true},
		hostile: {value: true},
		behavior: {value: function (state, press){
			if(this.time > 4){
				this.sequence("jump");
				return;
			}
			this.arm();
			fighter.jump_punch.parent.behavior.call(this, state, press);
		}}
	});
	fighter.low_kick = Object.create(sequence, {
		parent: {value: sequence},
		initial_state: {value: "low-kick-prep"},
		low: {value: true},
		hostile: {value: true},
		behavior: {value: function (state, press){
			// TODO: Handle when kicks and sequences have x,y velocity. The 'initial' is the problem.
			//if((this.time > 11 && !initial(x_vel)) || this.time > 16){
			if(this.time > 11){
				this.sequence("low");
				return;
			}
			if(this.time > 7){
				this.fighter.icon_state = "low-kick-prep";
				this.disarm()
			}
			else if(this.time > 3){
				this.fighter.x_vel += DM.sign(this.fighter.direction) * this.x_vel;
				this.x_vel = 0;
				this.arm();
				this.fighter.icon_state = "low-kick";
			}
			fighter.low_kick.parent.behavior.call(this, state, press);
		}}
	});
	fighter.hi_kick = Object.create(sequence, {
		parent: {value: sequence},
		initial_state: {value: "hi-kick-prep"},
		hostile: {value: true},
		behavior: {value: function (state, press){
			if(this.time > 11){
				this.sequence("stand");
				return;
			}
			if(this.time > 7){
				this.icon_state = "hi-kick-prep";
				this.disarm();
			}
			else if(this.time > 3){
				this.arm();
				this.fighter.icon_state = "hi-kick";
			}
			fighter.hi_kick.parent.behavior.call(this, state, press);
		}}
	});
	fighter.jump_kick = Object.create(sequence, {
		parent: {value: sequence},
		initial_state: {value: "jump-kick"},
		move_lock: {value: true},
		hostile: {value: true},
		behavior: {value: function (state, press){
			this.arm();
			if(this.time > 4){
				this.sequence("jump");
				return;
			}
			fighter.jump_kick.parent.behavior.call(this, state, press);
		}}
	});
	fighter.hurting = Object.create(sequence, {
		parent: {value: sequence},
		initial_state: {value: "hi-hurt"},
		hurting: {value: true},
		// TODO:
		New: {value: function (_fighter, lock){
			// Also, _fighter is necessary because this.fighter hasn't been asigned until the call to .=..()
			var old_sequence = _fighter.sequence;
			this.low = old_sequence.low;
			if(this.low){
				this.initial_state = "low-hurt";
			}
			fighter.hurting.parent.New.call(this, _fighter, lock);
		}},
		behavior: {value: function (state, press){
			fighter.hurting.parent.behavior.call(this, state, press);
			if(this.time > 7){
				if(this.low){
					this.sequence("low");
					return;
				} else{
					this.sequence("stand");
					return;
				}
			}
		}}
	});
	fighter.trip = Object.create(sequence, {
		parent: {value: sequence},
		initial_state: {value: "jump-hurt"},
		hurting: {value: true},
		move_lock: {value: true},
		New: {value: function (_f, _lock){
			fighter.trip.parent.New.call(this, _f, _lock);
			if(!this.fighter.Y){
				this.fighter.y_vel = this.fighter.jump_speed;
			}
			else{
				this.fighter.y_vel = this.fighter.jump_speed*2/3
			}
			if(this.fighter.direction == DM.EAST){ this.key_lock = DM.WEST;}
			if(this.fighter.direction == DM.WEST){ this.key_lock = DM.EAST;}
		}}
	});
	fighter.dead = Object.create(sequence, {
		parent: {value: sequence},
		initial_state: {value: "dead"},
		hurting: {value: DM.BREAKING},
		low: {value: true},
		behavior: {value: function (state, press){
			if(this.fighter.health>0){
				fighter.dead.parent.behavior.call(this, state, press);
				if(this.time > 9){
					this.sequence("low");
					return;
				}
			}
		}}
	});
	fighter.win = Object.create(sequence, {
		parent: {value: sequence},
		initial_state: {value: "victory"}
	});
	fighter.loose = Object.create( sequence, {
		parent: {value: sequence},
		initial_state: {value: "hi-hurt"}
	});
	return sequence;
})();