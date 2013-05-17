module.exports = (function (){
	var DM = require('./dm.js');
	var fighter = {
		model_id: undefined,
		battle: undefined,
		X: undefined,
		Y: undefined,
		direction: undefined,
		width: 28, // Temp
		height: 59, // Temp
		speed: 4, // Temp
		jump_speed: 15, // Temp
		y_vel: 0,
		x_vel: 0,
		gravity: -2.5,
		intelligence: undefined,
		health: 100, // Temp
		max_health: undefined,
		sequence: undefined,
		opponent: undefined,
		standing_height: 59,
		low_height: 40,
		ai: {behavior: function (){
			
		}},
		setup: function (controller){
			this.health = this.max_health;
			this.intelligence = controller;
		},
		dispose: function(){
			this.battle = null;
			this.sequence.dispose();
			this.sequence = null;
			this.opponent = null;
			this.intelligence = null;
		},
		hurt: function (amount, low, proxy_sequence){
			var pole_to = ((this.X>this.opponent.X)? 1 : -1);
			this.X += pole_to*amount;
			this.opponent.X -= pole_to*amount;
			if(this.sequence.guarding){
				if(this.sequence.low && !this.opponent.Y){ return;}
				if(!this.sequence.low && !this.low){ return;}
			}
			this.health -= amount;
			// TODO: What the hell do I do with a spawn statement?
			// Maybe it was needed because die might delete the object? That's no longer a problem.
			//spawn(){
				if(this.Y || this.health <=0 || (low && !this.sequence.low)){
					this.sequence.sequence("trip");
				}
				else{
					this.sequence.sequence("hurting");
				}
			//}
			// TODO: Battle bars?
			//this.battle.update_bars();
			if(this.health <= 0){
				this.battle.end();
			}
		},
		behavior: function (){
			if(!this.battle.ended){
				// TODO: istype to deal with computers again.
				if(this.intelligence){
					this.sequence.behavior(this.intelligence.key_state.key_state, this.intelligence.key_state.key_pressed);
					this.intelligence.key_state.clear_keys();
				}
				// TODO: Make AI.
				else{
					this.ai.behavior(this);
				}
			}
			else{
				this.sequence.behavior(0,0);
			}
			this.X = Math.min(
				this.battle.center+(this.battle.screen_width/2)-this.width/2,
				this.battle.width,
				Math.max(
					0,
					this.X,
					this.battle.center-(this.battle.screen_width/2)+this.width/2
				)
			);
			if(!this.Y && this.y_vel < 0){
				this.y_vel = 0;
				if(this.health > 0 && !this.sequence.hurting){
					this.sequence.sequence("stand");
				}
				else{
					this.sequence.sequence("dead");
				}
			}
			if(Math.abs(this.X-this.opponent.X) < this.width/2+this.opponent.width/2){
				if((this.Y>=this.opponent.Y&&this.Y<=this.opponent.Y+this.opponent.height) || (this.opponent.Y>=this.Y&&this.opponent.Y<=this.Y+this.height)){
					var separation = (this.direction==DM.EAST)? -this.speed : this.speed;
					this.X += separation;
					this.opponent.X -= separation;
				}
			}
			if(this.Y || this.y_vel){
				this.Y += this.y_vel;
				this.y_vel += this.gravity;
				this.Y = Math.max(this.Y, 0);
			}
			if(this.x_vel){
				this.X += this.x_vel;
				this.x_vel -= DM.pole(this.x_vel);
			}
			if(!this.Y && !this.sequence.hurting){
				if(this.X > this.opponent.X){
					this.direction = DM.WEST;
				}
				else{
					this.direction = DM.EAST;
				}
			}
		},
        create_from_model: function (model_id){
            var model;
            var new_fighter;
            switch(model_id){
                case 'sean': {
                    model = require('./sean.js');
                    break;
                }
                case 'alea': {
                    model = require('./alea.js');
                    break;
                }
                default: {
                    model = require('./sean.js');
                }
            }
            new_fighter = Object.create(model);
            return new_fighter;
        }
	};
	return fighter;
})();