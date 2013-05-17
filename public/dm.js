var DM = {
	default_screen_width: 256,
	default_screen_height: 192,
	pole: function pole(x){
		if(isNaN(x)){
			return NaN;
		} else{
			var result = x / Math.abs(x);
			return result;
		}
	},
	sign: function sign(d){
		if(d == DM.EAST){
			return 1;
		} else{
			return -1;
		}
	},
    NORTH: 1,
    SOUTH: 2,
    EAST: 4,
    WEST: 8,
	PRIMARY: 16,
	SECONDARY: 32,
	TERTIARY: 64,
	QUATERNARY: 128,
    flip: function (dir_flag){
        dir_flag = parseInt(dir_flag);
        if(dir_flag < 1 || dir_flag > 16){
            return NaN;
        } else{
            var result;
            switch(dir_flag){
                case  1: { result =  2; break;}
                case  5: { result = 10; break;}
                case  4: { result =  8; break;}
                case  6: { result =  9; break;}
                case  2: { result =  1; break;}
                case 10: { result =  5; break;}
                case  8: { result =  4; break;}
                case  9: { result =  6; break;}
            }
            return result;
        }
    },
    PUNCH: 16,
    KICK: 32,
    GUARD: 64,
    BREAKING: 2
};