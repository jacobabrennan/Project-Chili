module.exports = (function (){
	var DM = require('./dm.js');
	var battle = {
		fighter_1: undefined,
		fighter_2: undefined,
		width: 512,
		height: 192,
		screen_width: 256,
		screen_height: 192,
		center: 256,
		delay: 1000/30,
        time_limit: 120, // In seconds, not 'tics'
		time: 0,
		ended: false,
		stopped: false,
		setup: function (match, fighter1, fighter2){
            this.match = match;
			this.fighter_1 = fighter1;
			this.fighter_2 = fighter2;
			this.fighter_1.battle = this;
			this.fighter_2.battle = this;
			this.fighter_1.opponent = this.fighter_2;
			this.fighter_2.opponent = this.fighter_1;
			this.fighter_1.X = 3*64; // TODO: Refactor out the MAGIC NUMBERS!
			this.fighter_2.X = 5*64; // TODO: Refactor out the MAGIC NUMBERS!
			this.fighter_1.Y = 0;
			this.fighter_2.Y = 0;
			var update_package = {
				'action': 'start',
				'width': this.width,
				'height': this.height,
				'screen_width': this.screen_width,
				'screen_height': this.screen_height,
                'time_limit': this.time_limit,
                'time': this.time,
                'delay': this.delay,
				'fighter_1': {
					model_id: this.fighter_1.model_id
				},
				'fighter_2': {
					model_id: this.fighter_2.model_id
				}
			};
			// TODO: handle AI;
			if(this.fighter_1.intelligence){
				this.fighter_1.intelligence.update(update_package);
			}
			if(this.fighter_2.intelligence){
				this.fighter_2.intelligence.update(update_package);
			}
        },
		dispose: function (){
            // TODO: Remove this temp stuff.
            var game = require('./game.js');
            game.waiting_client = null;
            game.waiting_fighter = null;
			// TODO: do bound functions contribute to garbage collection?
			this.fighter_1.dispose();
			this.fighter_2.dispose();
            this.match = null;
			this.fighter_1 = null;
			this.fighter_2 = null;
			this.iterate = null;
		},
        start: function (){
			this.iterate = this.iterate.bind(this);
			this.iterate();
		},
		iterate: function (){
			if(!this.iterate){
				return;
			}
			this.fighter_1.behavior();
			this.fighter_2.behavior();
			this.reposition();
			this.time++;
            var max_ticks = Math.ceil((this.time_limit*1000)/this.delay);
            if(this.time > max_ticks){
                this.end();
            }
			this.update();
			setTimeout(this.iterate, this.delay);
		},
		update: function (){
			var update_package = {
				'action': 'update',
				'time': this.time,
				center: this.center,
				fighter_1: {
					x: this.fighter_1.X,
					y: this.fighter_1.Y,
					width: this.fighter_1.width,
					height: this.fighter_1.height,
					color: this.fighter_1.color,
					state: this.fighter_1.icon_state,
					direction: this.fighter_1.direction,
					health: this.fighter_1.health / this.fighter_1.max_health
				},
				fighter_2: {
					x: this.fighter_2.X,
					y: this.fighter_2.Y,
					width: this.fighter_2.width,
					height: this.fighter_2.height,
					color: this.fighter_2.color,
					state: this.fighter_2.icon_state,
					direction: this.fighter_2.direction,
					health: this.fighter_2.health / this.fighter_2.max_health
				}
			}
			// TODO: handle AI;
			if(this.fighter_1.intelligence){
				this.fighter_1.intelligence.update(update_package);
			}
			if(this.fighter_2.intelligence){
				this.fighter_2.intelligence.update(update_package);
			}
		},
		reposition: function (){
			var delta = this.fighter_2.X - this.fighter_1.X;
			this.center = this.fighter_1.X + delta/2;
	//-64 x -192
			this.center = Math.max(this.screen_width/2, Math.min(this.width-(this.screen_width/2), this.center));
		},
		end: function (){
			if(this.ended){
				return
			}
			this.ended = true;
			var winner = ((this.fighter_1.health/this.fighter_1.max_health)>=(this.fighter_2.health/this.fighter_2.max_health))? this.fighter_1 : this.fighter_2
			var looser = (winner == this.fighter_1) ? this.fighter_2 : this.fighter_1
			this.delay *= 2;
			var delayed = function (){
				this.delay /= 2
				winner.sequence.sequence('win');
				if(looser.icon_state != 'dead'){
					looser.sequence.sequence('loose');
				}
				this.update();
				var update_package = {
					'action': 'end',
				}
				// TODO: handle AI;
				if(this.fighter_1.intelligence){
					this.fighter_1.intelligence.update(update_package);
				}
				if(this.fighter_2.intelligence){
					this.fighter_2.intelligence.update(update_package);
				}
				var winner_code = (winner === this.fighter_1)? 1 : 2;
				this.match.battle_finished(winner_code);
				this.dispose();
			}
			delayed = delayed.bind(this);
			setTimeout(delayed, 4000);
		},
		force_end: function (){
			// TODO: Create appropriate function for when a PvE game is interrupted by a player challenge;
			/*
			if(stop){ return}
			stop = TRUE
			spawn(40){
				if(istype(fighter_1.int)){
					waiters.Insert(1,fighter_1.int)
					waiters[fighter_1.int] = fighter_1.type
				}
				src = null
				battle.Del()
				for(var/client/C){
					if(C in waiters){ C.vs_screen()}
					else if(battle){
						if(battle.fighter_1.int == C || battle.fighter_2.int == C){
							C.vs_screen()
						}
						else{
							C.title()
						}
					}
					else{
						C.title()
					}
				}
			}*/
		}
	};
	return battle;
})();