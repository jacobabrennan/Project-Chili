module.exports = (function (){
	var DM = require('./dm.js');
    var battle = require('./battle.js');
    var fighter = require('./fighter.js');
	var match = {
		id: undefined,
        wins: 2,
		fighter_1_wins: 0,
		fighter_2_wins: 0,
        battle: undefined,
		model_1: undefined,
		model_2: undefined,
		controller_1: undefined,
		controller_2: undefined,
        setup: function (model_1, model_2, controller_1, controller_2){
			this.id = Math.floor(Math.random()*9999);
            this.model_1 = model_1;
            this.model_2 = model_2;
            this.controller_1 = controller_1;
            this.controller_2 = controller_2;
        },
        dispose: function (){
            this.battle.dispose();
        },
        start: function (){
			this.update('start');
			var self = this;
			setTimeout(function (){
				self.next_battle()
			}, 100)
        },
		end: function (winner){
			this.update('end');
		},
		battle_finished: function (winner_code){
			if(winner_code == 1){
				this.fighter_1_wins++;
				if(this.fighter_1_wins >= this.wins){
					this.end(this.fighter_1);
					return;
				}
			} else{
				this.fighter_2_wins++;
				if(this.fighter_2_wins >= this.wins){
					this.end(this.fighter_2);
					return;
				}
			}
			console.log("Next");
			this.next_battle();
		},
        next_battle: function (){
            var fighter1 = fighter.create_from_model(this.model_1);
            var fighter2 = fighter.create_from_model(this.model_2);
			fighter1.direction = DM.EAST;
			fighter2.direction = DM.WEST;
			fighter1.sequence = Object.create(fighter.stand);
			fighter1.sequence.New(fighter1);
			fighter2.sequence = Object.create(fighter.stand);
			fighter2.sequence.New(fighter2);
			fighter1.setup(this.controller_1);
			fighter2.setup(this.controller_2);
			// TODO: create AI controller.
			//fighter2.intelligence = controller2;
            var new_battle = Object.create(battle);
            new_battle.setup(this, fighter1, fighter2);
            new_battle.start();
        },
		update: function (stage){
			var update_package;
			switch(stage){
				case 'start': {
					update_package = {
						'id': this.id
					};
					break;
				}
				case 'end': {
					update_package = {
						'action': 'end'
					}
					break;
				}
			}
			// TODO: handle AI;
			if(this.controller_1){
				this.controller_1.update(update_package);
			}
			if(this.controller_2){
				this.controller_2.update(update_package);
			}
		}
    };
	return match;
})();