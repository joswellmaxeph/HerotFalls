var setPlayerInfo = function(player) {
    var player_info = {};
    player_info.moveable = player.moveable;
    player_info.attack_points = player.attack_points;
    player_info.defense_points = player.defense_points;
    player_info.trep_points = player.trep_points;
    player_info.hit_points = player.hit_points;
    player_info.fight_mode = player.fight_mode;
    player_info.got_sword = player.got_sword;
    player_info.got_milk = player.got_milk;
    player_info.got_milk_bottle = player.got_milk_bottle;
    player_info.got_scared = player.got_scared;
    player_info.got_shield = player.got_shield;
    player_info.fought_monster = player.fought_monster;
    player_info.fought_monster2 = player.fought_monster2;
    player_info.fought_monster3 = player.fought_monster3;
    player_info.got_blanket = player.got_blanket;
    player_info.had_nightmare = player.had_nightmare;
    player_info.had_gooddream = player.had_gooddream;
    player_info.got_axe = player.got_axe;
    player_info.chopped_tree = player.chopped_tree;
    player_info.got_poison = player.got_poison;
    player_info.got_socks = player.got_socks;
    Crafty.storage('player_info', player_info);
    console.log('setPlayerInfo:::');
    console.log(Crafty.storage('player_info'));
}

var setPlayerPos = function(pos) {
    var player_info = Crafty.storage('player_info');
    player_info.pos_x = pos.x;
    player_info.pos_y = pos.y;
    Crafty.storage('player_info', player_info);
}

var setPlayerDir = function(dir) {
    var player_info = Crafty.storage('player_info');
    player_info.dir = dir;
    Crafty.storage('player_info', player_info);
}

// The Grid component allows an element to be located
//  on a grid of tiles
Crafty.c('Grid', {
	init: function() {
		this.attr({
			w: Game.map_grid.tile.width,
			h: Game.map_grid.tile.height
		});
	},

	// Locate this entity at the given position on the grid
	at: function(x, y) {
		if (x === undefined && y === undefined) {
			return { x: this.x/Game.map_grid.tile.width, y: this.y/Game.map_grid.tile.height };
		} else {
			this.attr({ x: x * Game.map_grid.tile.width, y: y * Game.map_grid.tile.height });
			return this;
		}
	}
});

// An "Actor" is an entity that is drawn in 2D on canvas
//  via our logical coordinate grid
Crafty.c('Actor', {
	init: function() {
		this.requires('2D, Canvas, Grid');
	},
});

// A Tree is just an Actor with a certain sprite
Crafty.c('RedTree', {
	init: function() {
		this.requires('Actor, Solid, spr_red_tree');
	},
});

// A Tree is just an Actor with a certain sprite
Crafty.c('YellowTree', {
	init: function() {
		this.requires('Actor, Solid, spr_yellow_tree');
	},
});

// A Tree is just an Actor with a certain sprite
Crafty.c('OrangeTree', {
	init: function() {
		this.requires('Actor, Solid, spr_orange_tree');
	},
});

Crafty.c('TextBack', {
    init: function() {
        this.requires('Actor, spr_text_back').at(3, 9.5);
        this.visible = false;
    },
});

Crafty.c('TextText', {
    init: function() {
        this.requires('2D, DOM, Text');
        this.visible = false;
    },
});   

Crafty.c('TownHall', {
    init: function() {
        this.requires('Actor, Solid, spr_hall');
    },
});

Crafty.c('House', {
    init: function() {
        this.requires('Actor, Solid, spr_house');
    },
});

Crafty.c('HouseDoor', {
    init: function() {
        this.requires('Actor, spr_door');
    },
    
    enter: function() {
        Crafty.scene('InHouse');
    },
});

Crafty.c('HouseBotLeft', {
    init: function() {
        this.requires('Actor, Solid, spr_bot_left');
    },
});

Crafty.c('HouseBotRight', {
    init: function() {
        this.requires('Actor, Solid, spr_bot_right');
    },
});

Crafty.c('HouseTile', {
    init: function() {
        this.requires('Actor, spr_tile');
    }
});

Crafty.c('HouseWall', {
    init: function() {
        this.requires('Actor, Solid, spr_wall');
    }
});

Crafty.c('Blinky', {
    init: function() {
        this.requires('Actor, Solid, SpriteAnimation, spr_blinky')
            .reel("Blink", 3200, 0, 0, 11);
            
        this.animate('Blink', -1);
    }
});

Crafty.c('Chompy', {
    init: function() {
        this.requires('Actor, Solid, SpriteAnimation, spr_chompy')
            .reel("Chomp", 1400, 0, 0, 6);
            
        this.animate('Chomp', -1);
    }
});

Crafty.c('HouseOut', {
    init: function() {
        this.requires('Actor, spr_house_out');
    }
});

Crafty.c('Sword', {
    init: function() {
        this.requires('Actor, spr_sword');
    },
    
    get: function() {
        this.destroy();
        Crafty.trigger('GotSword', this);
    },
});

Crafty.c('MilkBottle', {
    init: function() {
        this.requires('Actor, spr_milk_bottle');
    },
    
    get: function() {
        this.destroy();
        Crafty.trigger('GotMilk', this);
    },
});

Crafty.c('PoisonBottle', {
    init: function() {
        this.requires('Actor, spr_poison_bottle');
    },
    
    get: function() {
        this.destroy();
        Crafty.trigger('GotPoison', this);
    },
});

Crafty.c('Socks', {
    init: function() {
        this.requires('Actor, spr_socks');
    },
    
    get: function() {
        this.destroy();
        Crafty.trigger('GotSocks', this);
    },
});

Crafty.c('Blanket', {
    init: function() {
        this.requires('Actor, spr_blanket');
    },
    
    get: function() {
        this.destroy();
        Crafty.trigger('GotBlanket', this);
    },
});

Crafty.c('DeadTree', {
    init: function() {
        this.requires('Actor, spr_dead_tree');
    }
});

Crafty.c('TrepPoints', {
    init: function() {
        this.requires('Actor, spr_trep_points, SpriteAnimation')
            .reel('tp8', 600, 0, 0, 1)
            .reel('tp7', 600, 1, 0, 1)
            .reel('tp6', 600, 2, 0, 1)
            .reel('tp5', 600, 3, 0, 1)
            .reel('tp4', 600, 4, 0, 1)
            .reel('tp3', 600, 5, 0, 1)
            .reel('tp2', 600, 6, 0, 1)
            .reel('tp1', 600, 7, 0, 1)
            .reel('tp0', 600, 8, 0, 1)
            .at(0.4, 0.1);
    },
});

Crafty.c('Mom', {
    init: function() {
        this.requires('Actor, spr_mom, SpriteAnimation')
            .reel('MomBounce', 600, 0, 0, 4)
            .reel('stop', 600, 0, 0, 1);
    },
    
    talk: function() {
        this.animate('MomBounce', -1);
        Crafty.trigger('MomTalk', this);
    },
});

Crafty.c('Lumberjack', {
    init: function() {
        this.requires('Actor, spr_lumberjack, SpriteAnimation')
            .reel('LumberjackBounce', 600, 0, 0, 4)
            .reel('stop', 600, 0, 0, 1);
    },
    
    talk: function() {
        this.animate('LumberjackBounce', -1);
        Crafty.trigger('LumberjackTalk', this);
    },
});

Crafty.c('TownGuy', {
    init: function() {
        this.requires('Actor, spr_town_guy, SpriteAnimation')
            .reel('TownGuyBounce', 600, 0, 0, 4)
            .reel('stop', 600, 0, 0, 1)
    },
    
    talk: function() {
        this.animate('TownGuyBounce', -1);
        Crafty.trigger('TownGuyTalk', this);
    },
});

Crafty.c('Bed', {
    init: function() {
        this.requires('Actor, spr_bed, SpriteAnimation')
            .reel('GuySleeping', 900, 1, 0, 5)
            .reel('stop', 900, 0, 0, 1);
    },
    
    hit: function() {
        console.log("bed.hit");
        if (!this.fought_monster) { // not bedtime yet
            Crafty.trigger('HitBed', this);
            console.log("hit bed");
        } else if (!this.got_blanket) { // it's bedtime and you're scared
            console.log("here");
            Crafty.trigger('HitBedNightmare', this);
        } else { // it's bedtime and you're good
            Crafty.trigger('HitBedGoodDream', this);
        }
    },
});

Crafty.c('BigMonster', {
    init: function() {
        this.requires('Actor, spr_big_monster, SpriteAnimation')
            .reel('MonsterBounce', 1500, 0, 0, 2)
        
        this.defense_points = 1;
        this.attack_points = 4;
        this.hit_points = 6;
        this.initial_fear = 2;
        this.animate('MonsterBounce', -1);
    },
    
    fight: function() {
        // TODO HERE
    },
});

Crafty.c('Monster', {
    init: function() {
        this.requires('Actor, spr_monster, SpriteAnimation')
            .reel('MonsterBounce', 900, 0, 0, 4)
        
        this.n = 1;
        this.defense_points = 1;
        this.attack_points = 2;
        this.hit_points = 4;
        this.initial_fear = 3;
        this.animate('MonsterBounce', -1);
    },
    
    fight: function() {
        // TODO HERE
    },
});

Crafty.c('Monster2', {
    init: function() {
        this.requires('Actor, spr_monster, SpriteAnimation')
            .reel('MonsterBounce', 900, 0, 0, 4)
        
        this.n = 2;
        this.defense_points = 1;
        this.attack_points = 3;
        this.hit_points = 2;
        this.initial_fear = 2;
        this.animate('MonsterBounce', -1);
    },
    
    fight: function() {
        // TODO HERE
    },
});

Crafty.c('Monster3', {
    init: function() {
        this.requires('Actor, spr_monster, SpriteAnimation')
            .reel('MonsterBounce', 900, 0, 0, 4)
        
        this.n = 3;
        this.defense_points = 1;
        this.attack_points = 3;
        this.hit_points = 6;
        this.initial_fear = 0;
        this.animate('MonsterBounce', -1);
    },
    
    fight: function() {
        // TODO HERE
    },
});

Crafty.c('EnterWoods', {
    init: function() {
        this.requires('Actor');
    },
    
    enter: function() {
        Crafty.scene('Woods');
    }
});

Crafty.c('LeaveWoods', {
    init: function() {
        this.requires('Actor');
    },
    
    enter: function() {
        Crafty.scene('Game');
    }
});

Crafty.c('EnterWoods2', {
    init: function() {
        this.requires('Actor');
    },
    
    enter: function() {
        Crafty.scene('Woods2');
    }
});

Crafty.c('LeaveWoods2', {
    init: function() {
        this.requires('Actor');
    },
    
    enter: function() {
        Crafty.scene('Woods');
    }
});

Crafty.c('EnterWoods3', {
    init: function() {
        this.requires('Actor');
    },
    
    enter: function() {
        Crafty.scene('Woods3');
    }
});

Crafty.c('LeaveWoods3', {
    init: function() {
        this.requires('Actor');
    },
    
    enter: function() {
        Crafty.scene('Woods2');
    }
});

Crafty.c('EnterWoodsBoss', {
    init: function() {
        this.requires('Actor');
    },
    
    enter: function() {
        Crafty.scene('WoodsBoss');
    }
});

Crafty.c('LeaveWoodsBoss', {
    init: function() {
        this.requires('Actor');
    },
    
    enter: function() {
        Crafty.scene('Woods2');
    }
});

Crafty.c('LeaveHouse', {
    init: function() {
        this.requires('Actor');
    },
    
    enter: function() {
        Crafty.scene('Game');
    }
});

// This is the player-controlled character
Crafty.c('PlayerCharacter', {
	init: function() {
		this.requires('Actor, Fourway, Collision, spr_player, SpriteAnimation')
			.fourway(2)
			.stopOnSolids()
			.onHit('EnterWoods', this.enterWoods)
            .onHit('LeaveWoods', this.leaveWoods)
			.onHit('EnterWoods2', this.enterWoods2)
            .onHit('LeaveWoods2', this.leaveWoods2)
            .onHit('EnterWoods3', this.enterWoods3)
            .onHit('LeaveWoods3', this.leaveWoods3)
            .onHit('EnterWoodsBoss', this.enterWoodsBoss)
            .onHit('LeaveWoodsBoss', this.leaveWoodsBoss)
            .onHit('HouseDoor', this.enterHouse)
            .onHit('LeaveHouse', this.leaveHouse)
            .onHit('Sword', this.hitSword)
            .onHit('MilkBottle', this.hitMilk)
            .onHit('Mom', this.momTalk)
            .onHit('TownGuy', this.townGuyTalk)
            .onHit('Monster', this.monsterFight)
            .onHit('Monster2', this.monsterFight)
            .onHit('Monster3', this.monsterFight)
            .onHit('Bed', this.hitBed)
            .onHit('Lumberjack', this.lumberjackTalk)
            .onHit('DeadTree', this.hitDeadTree)
            .onHit('Blanket', this.hitBlanket)
            .onHit('PoisonBottle', this.hitPoison)
            .onHit('Socks', this.hitSocks)
            .onHit('BigMonster', this.hitBoss)
            .reel('StopPlayerMovingUp',    600, 0, 0, 1)
            .reel('StopPlayerMovingRight', 600, 0, 3, 1)
            .reel('StopPlayerMovingDown',  600, 0, 1, 1)
            .reel('StopPlayerMovingLeft',  600, 0, 2, 1)
			.reel('PlayerMovingUp',    600, 0, 0, 4)
			.reel('PlayerMovingRight', 600, 0, 3, 4)
			.reel('PlayerMovingDown',  600, 0, 1, 4)
			.reel('PlayerMovingLeft',  600, 0, 2, 4)
            .reel('PlayerFightingUp',  600, 0, 4, 6);
        
        this.bind('Moved', function(data) {
            if (!this.moveable || this.fight_mode) {
                this.x = data.x;
                this.y = data.y;
            }
        });
        
		this.bind('NewDirection', function(data) {
            if (!this.moveable) {
                this.animate('Stop' + this.dir, -1);
                return;
            }
            
            if (this.fight_mode) {
                return;
            }
            
			if (data.x > 0) {
                this.dir = 'PlayerMovingRight';
				this.animate('PlayerMovingRight', -1);
			} else if (data.x < 0) {
                this.dir = 'PlayerMovingLeft';
				this.animate('PlayerMovingLeft', -1);
			} else if (data.y > 0) {
                this.dir = 'PlayerMovingDown';
				this.animate('PlayerMovingDown', -1);
			} else if (data.y < 0) {
                this.dir = 'PlayerMovingUp';
				this.animate('PlayerMovingUp', -1);
			} else {
				this.pauseAnimation();
			}
		});
	},

	// Registers a stop-movement function to be called when
	//  this entity hits an entity with the "Solid" component
	stopOnSolids: function() {
		this.onHit('Solid', this.stopMovement);
		return this;
	},

	// Stops the movement
	stopMovement: function() {
		this._speed = 0;
		if (this._movement) {
			this.x -= this._movement.x;
			this.y -= this._movement.y;
		}
	},

	// Respond to this player visiting a village
	visitVillage: function(data) {
		villlage = data[0].obj;
		villlage.visit();
	},
    
    enterWoods: function(data) {
        comp = data[0].obj;
        setPlayerInfo(this);
        setPlayerPos({x: 9.5, y: 11});
        setPlayerDir('PlayerMovingUp');
        comp.enter();
    },
    
    leaveWoods: function(data) {
        out = data[0].obj;
        setPlayerInfo(this);
        setPlayerPos({x: 9.5, y: 0});
        setPlayerDir('PlayerMovingDown');
        out.enter();
    },
    
    enterWoods2: function(data) {
        comp = data[0].obj;
        setPlayerInfo(this);
        setPlayerPos({x: 14, y: 11});
        setPlayerDir('PlayerMovingUp');
        comp.enter();
    },
    
    leaveWoods2: function(data) {
        out = data[0].obj;
        setPlayerInfo(this);
        setPlayerPos({x: 14, y: 0});
        setPlayerDir('PlayerMovingDown');
        out.enter();
    },
    
    enterWoods3: function(data) {
        comp = data[0].obj;
        setPlayerInfo(this);
        setPlayerPos({x: 0, y: 5});
        setPlayerDir('PlayerMovingRight');
        comp.enter();
    },
    
    leaveWoods3: function(data) {
        out = data[0].obj;
        setPlayerInfo(this);
        setPlayerPos({x: 19, y: 5});
        setPlayerDir('PlayerMovingLeft');
        out.enter();
    },
    
    enterWoodsBoss: function(data) {
        comp = data[0].obj;
        setPlayerInfo(this);
        setPlayerPos({x: 8.5, y: 11});
        setPlayerDir('PlayerMovingUp');
        comp.enter();
    },
    
    leaveWoodsBoss: function(data) {
        out = data[0].obj;
        setPlayerInfo(this);
        setPlayerPos({x: 8, y: 0});
        setPlayerDir('PlayerMovingDown');
        out.enter();
    },
    
    enterHouse: function(data) {
        house = data[0].obj;
        setPlayerInfo(this);
        setPlayerDir('PlayerMovingUp');
        setPlayerPos({x: 9.5, y: 11});
        house.enter();
    },
    
    leaveHouse: function(data) {
        out = data[0].obj;
        setPlayerInfo(this);
        setPlayerPos({x: 5-(4/32.0), y: 6.1});
        setPlayerDir('PlayerMovingDown');
        out.enter();
    },
    
    hitSword: function(data) {
        sword = data[0].obj;
        this.attack_points += 1;
        this.got_sword = true;
        setPlayerInfo(this);
        sword.get();
    },
    
    hitMilk: function(data) {
        milk_bottle = data[0].obj;
        this.trep_points += 3;
        if (this.trep_points > 8) { this.trep_points = 8; }
        this.got_milk_bottle = true;
        setPlayerInfo(this);
        milk_bottle.get();
    },
    
    hitPoison: function(data) {
        poison_bottle = data[0].obj;
        this.trep_points -= 1;
        if (this.trep_points < 1) {
            Crafty.bind('AfterTalk', function() { Crafty.scene("Dead"); });
        }
        this.got_poison = true;
        setPlayerInfo(this);
        poison_bottle.get();
    },
    
    hitSocks: function(data) {
        socks = data[0].obj;
        this.defense_points += 1;
        this.got_socks = true;
        setPlayerInfo(this);
        socks.get();
    },
    
    hitBlanket: function(data) {
        blanket = data[0].obj;
        this.got_blanket = true;
        setPlayerInfo(this);
        blanket.get();
    },
    
    momTalk: function(data) {
        this._speed = 0;
		if (this._movement) {
			this.x -= this._movement.x;
			this.y -= this._movement.y;
		}
        mom = data[0].obj;
        mom.animate('MomBounce', -1);
        mom.talk();
        if (!this.got_milk) {
            this.trep_points += 1;
            this.got_milk = true;
            setPlayerInfo(this);
        }
    },
    
    lumberjackTalk: function(data) {
        this._speed = 0;
		if (this._movement) {
			this.x -= this._movement.x;
			this.y -= this._movement.y;
		}
        lumberjack = data[0].obj;
        lumberjack.talk();
        if (!this.got_axe) {
            this.got_axe = true;
            setPlayerInfo(this);
        }
    },
    
    hitDeadTree: function(data) {
        this._speed = 0;
		if (this._movement) {
			this.x -= this._movement.x;
			this.y -= this._movement.y;
		}
        dead_tree = data[0].obj;
        if (this.got_axe) {
            this.chopped_tree = true;
            setPlayerInfo(this);
            Crafty.trigger("ChoppedTree", dead_tree);
        }
    },
    
    townGuyTalk: function(data) {
        this._speed = 0;
		if (this._movement) {
			this.x -= this._movement.x;
			this.y -= this._movement.y;
		}
        town_guy = data[0].obj;
        town_guy.animate('TownGuyBounce', -1);
        town_guy.talk();
        if (!this.got_scared && !this.fought_monster) {
            this.trep_points -= 1;
            if (this.trep_points == 0) {
                Crafty.bind('AfterTalk', function() { Crafty.scene("Dead"); });
            }
            
            this.got_scared = true;
            setPlayerInfo(this);
        } else if (this.fought_monster) {
            this.defense_points += 1;
            this.got_shield = true;
            setPlayerInfo(this);
        } else if (!this.got_scared) {
            this.defense_points += 2;
            this.got_shield = true;
            setPlayerInfo(this);
        }
    },
    
    hitBed: function(data) {
        this._speed = 0;
		if (this._movement) {
			this.x -= this._movement.x;
			this.y -= this._movement.y;
		}
        bed = data[0].obj;
        if (!this.fought_monster || this.had_nightmare || this.had_gooddream) {
            Crafty.trigger("HitBed", bed);
        } else if (!this.got_blanket) {
            this.trep_points -= 1;
            if (this.trep_points <= 0) {
                Crafty.bind('AfterTalk', function() { Crafty.scene("Dead"); });
            }
            
            this.had_nightmare = true;
            setPlayerInfo(this);
            Crafty.trigger("HitBedNightmare", bed);
        } else if (this.got_blanket) {
            this.trep_points += 7;
            if (this.trep_points > 8) {
                this.trep_points = 8;
            }
            
            this.had_gooddream = true;
            setPlayerInfo(this);
            Crafty.trigger("HitBedGoodDream", bed);
        } 
    },
    
    hitBoss: function(data) {
        setPlayerDir("PlayerMovingUp");
        Crafty.trigger("BossTalk");
        this.animate('PlayerFightingUp', -1);
        if (this._movement) {
            this.y -= this._movement.y;
            this.x -= this._movement.x;
        }

        this.fight_mode = true;
        monster = data[0].obj;
        
        this.trep_points -= monster.initial_fear;
        
        setPlayerInfo(this);
        
        var ent = Crafty.e("Delay");
        var fightCycle = function () {
            var player_info = Crafty.storage('player_info');
            if (!Crafty.storage('boss_fight')) {
                return;
            } else {
                Crafty.trigger("StartFight", player_info.trep_points);
            }
            
            var monster_hit = player_info.attack_points - monster.defense_points;
            if (monster_hit < 0) { monster_hit = 0; }
            monster.hit_points -= monster_hit;
            
            if (monster.hit_points < 1) {
                ent.cancelDelay(fightCycle);
                monster.destroy();
                Crafty.trigger('WonGame');
                console.log(Crafty.storage('player_info').trep_points);
                return;
            }
        
            var player_hit = monster.attack_points - player_info.defense_points;
            if (player_hit < 0) { player_hit = 0; }
            if (monster_hit == 0 && player_hit == 0) { player_hit = 1; }
            player_info.trep_points -= player_hit;
            setPlayerInfo(player_info);
            
            if (player_info.trep_points < 1) {
                ent.cancelDelay(fightCycle);
                player_info.trep_points = 0;
                setPlayerInfo(player_info);
                Crafty.trigger('AnimateTrep');
                return;
            }
                
            Crafty.trigger('AnimateTrep');
        };
        
        ent.delay(fightCycle, 1800, -1);
    },
    
    monsterFight: function(data) {
        this.animate('PlayerFightingUp', -1);
        if (this._movement) {
            this.y -= this._movement.y;
            this.x -= this._movement.x;
        }

        this.fight_mode = true;
        monster = data[0].obj;
        
        this.trep_points -= monster.initial_fear;
        
        if (monster.n == 1) {
            this.fought_monster = true;
        } else if (monster.n == 2) {
            this.fought_monster2 = true;
        } else if (monster.n == 3) {
            this.fought_monster3 = true;
        }
        
        setPlayerInfo(this);
        Crafty.trigger('AnimateTrep');
        
        var ent = Crafty.e("Delay");
        var fightCycle = function () {
            var player_info = Crafty.storage('player_info');
            var monster_hit = player_info.attack_points - monster.defense_points;
            if (monster_hit < 0) { monster_hit = 0; }
            monster.hit_points -= monster_hit;
            
            if (monster.hit_points < 1) {
                ent.cancelDelay(fightCycle);
                monster.destroy();
                Crafty.trigger('DoneFighting');
                console.log(Crafty.storage('player_info').trep_points);
                return;
            }
        
            var player_hit = monster.attack_points - player_info.defense_points;
            if (player_hit < 0) { player_hit = 0; }
            player_info.trep_points -= player_hit;
            setPlayerInfo(player_info);
            Crafty.trigger('AnimateTrep');
            
            if (player_info.trep_points < 1) {
                ent.cancelDelay(fightCycle);
                Crafty.scene('Dead');
                return;
            }
        };
        
        ent.delay(fightCycle, 1000, -1);
    },
});

// A village is a tile on the grid that the PC must visit in order to win the game
Crafty.c('Village', {
	init: function() {
		this.requires('Actor, spr_village');
	},

	// Process a visitation with this village
	visit: function() {
		this.destroy();
		Crafty.audio.play('knock');
		Crafty.trigger('VillageVisited', this);
	}
});