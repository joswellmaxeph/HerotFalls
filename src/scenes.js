// player info storage
var player_info = {
    moveable: true,
    attack_points: 1,
    defense_points: 1,
    trep_points: 6,
    hit_points: 3,
    pos_x: 8,
    pos_y: 7,
    dir: 'PlayerMovingDown',
    fight_mode: false,
    first_scene: true,
    got_milk: false,
    got_milk_bottle: false,
    got_sword: false,
    got_scared: false,
    got_shield: false,
    fought_monster: false,
    fought_monster2: false,
    fought_monster3: false,
    got_blanket: false,
    had_nightmare: false,
    had_gooddream: false,
    got_axe: false,
    chopped_tree: false,
    got_poison: false,
    got_socks: false,
}

Crafty.storage('player_info', player_info);
Crafty.storage('now_playing', '');
Crafty.storage('boss_fight', false);

console.log(Crafty.storage('player_info'));

var makePlayer = function() {
    var player_info = Crafty.storage('player_info');
    console.log('makePlayer:::');
    console.log(player_info);
    player = Crafty.e('PlayerCharacter');
    player.moveable = player_info.moveable;
    player.attack_points = player_info.attack_points;
    player.defense_points = player_info.defense_points;
    player.trep_points = player_info.trep_points;
    player.hit_points = player_info.hit_points;
    player.fight_mode = player_info.fight_mode;
    player.got_milk = player_info.got_milk;
    player.got_milk_bottle = player_info.got_milk_bottle;
    player.got_sword = player_info.got_sword;
    player.got_scared = player_info.got_scared;
    player.got_shield = player_info.got_shield;
    player.fought_monster = player_info.fought_monster;
    player.fought_monster2 = player_info.fought_monster2;
    player.fought_monster3 = player_info.fought_monster3;
    player.got_blanket = player_info.got_blanket;
    player.had_nightmare = player_info.had_nightmare;
    player.had_gooddream = player_info.had_gooddream;
    player.got_axe = player_info.got_axe;
    player.chopped_tree = player_info.chopped_tree;
    player.got_poison = player_info.got_poison;
    player.got_socks = player_info.got_socks;
    return player;
}

var sceneMusic = function(scene_music) {
    var now_playing = Crafty.storage('now_playing');
    if (scene_music != now_playing) {
        Crafty.audio.stop();
        Crafty.audio.play(scene_music, -1);
        Crafty.storage('now_playing', scene_music);
    }
}

var animateTrep = function(trep_points) {
    var tp = Crafty.storage('player_info').trep_points;
    if (tp < 1) {
        trep_points.animate('tp0', 1);
        Crafty.e('Delay').delay(function() { Crafty.scene("Dead"); }, 300, 1);
    } else {
        trep_points.animate('tp' + Crafty.storage('player_info').trep_points, 1);
    }
}
    

// function to show an array of text values, in succession.
// this will pause the player's movement
var showText = function(player, text_back, bottom_text, str_texts, callback) {
    player.moveable = false;
    var count = 0;
    text_back.visible = true;
    bottom_text.text(str_texts[0]);
    bottom_text.bind('KeyDown', function(e) {
        if (e.key == Crafty.keys.ENTER) {
            count++;
            if (count >= str_texts.length) {
                text_back.visible = false;
                bottom_text.visible = false;
                player.moveable = true;
                bottom_text.unbind('KeyDown');
                Crafty.trigger('AfterTalk');
                Crafty.unbind('AfterTalk');
                if (callback != undefined) {
                    callback();
                }
            }
        
            this.text(str_texts[count]);
        }
    });
    
    bottom_text.visible = true;
}
    

// Game scene
// -------------
// Runs the core gameplay loop
Crafty.scene('Game', function() {
    var player_info = Crafty.storage('player_info');

	// Place a tree at every edge square on our grid of 16x16 tiles
	for (var x = 0; x < Game.map_grid.width; x++) {
		for (var y = 0; y < Game.map_grid.height; y++) {
			var at_edge = x == 0 || x == Game.map_grid.width - 1 || y == 0 || y == Game.map_grid.height - 1;
            var special_edge = y == 0 && x > 8 && x < 11;
			if (at_edge && !special_edge) {
				// Place a tree entity at the current tile
                var tree_color = Math.random();
                if (tree_color < 4/10) {
                    Crafty.e('RedTree').at(x, y);
                } else if (tree_color < 5/10) {
                    Crafty.e('YellowTree').at(x, y);
                } else {
                    Crafty.e('OrangeTree').at(x, y);
                }
			} else if (special_edge) {
                Crafty.e('EnterWoods').at(x, y-1);
            }
		}
	}
    
    Crafty.e('TownHall').at(12, 2);
    Crafty.e('House').at(3, 3);
    Crafty.e('HouseBotLeft').at(3+(6/32.0), 6);
    Crafty.e('HouseDoor').at(5-(4/32.0), 6);
    Crafty.e('HouseBotRight').at(6+(4/32.0), 6);
    
    Crafty.e('TownGuy').at(12, 6);
    
    Crafty.e('Blinky').at(14, 8);
    Crafty.e('Chompy').at(3, 7);
    
	player = makePlayer().at(player_info.pos_x, player_info.pos_y);
    
    trep_points = Crafty.e('TrepPoints');
    animateTrep(trep_points);
    
    text_back = Crafty.e('TextBack');
    bottom_text = Crafty.e('2D, DOM, Text')
            .attr({x: 0, y: 32*10.2, w: Game.width()})
            .textFont($text_css);
            
    var showTextScene = function(str_texts, callback) {
        showText(player, text_back, bottom_text, str_texts, callback);
    }
        
    var starts = ["Herot Falls is a simple farming town...",
                  "Its residents are generally safe...",
                  "Unless they venture North into the woods..."]
            
    if (player_info.first_scene) {
        showTextScene(starts);
    }

	sceneMusic('ring');

	// Show the victory screen once all villages are visisted
	this.show_victory = this.bind('VillageVisited', function() {
		if (!Crafty('Village').length) {
			Crafty.scene('Victory');
		}
	});
    
    this.bind('GotSword', function() {
        showTextScene(["You found a wooden sword!!!!", "It's one step up from a stick...", "Your attack points go up one."]);
    });
    
    this.bind('HitBed', function(bed) {
        showTextScene(["Mom: It's not bedtime yet!"]);
    });
    
    this.bind('HitBedNightmare', function(bed) {
        bed.animate('GuySleeping', -1);
        player.visible = false;
        showTextScene(["You go to sleep...",
                       "You start to dream...",
                       "The monster is after you!",
                       "You can't escape!",
                       "You wake in a cold sweat...",
                       "You lose a little courage."],
                       function() { player.visible = true; Crafty.trigger('AnimateTrep'); bed.animate('stop', -1); });
    });
    
    this.bind('HitBedGoodDream', function(bed) {
        bed.animate('GuySleeping', -1);
        player.visible = false;
        showTextScene(["You go to sleep...",
                       "Your blanket is nice and cozy...",
                       "You start to dream...",
                       "The monster is after you!",
                       "You face him and emerge triumphant!",
                       "You wake up well-rested.",
                       "You gain a lot courage!"],
                       function() { player.visible = true; Crafty.trigger('AnimateTrep'); bed.animate('stop', -1); });
    });
    
    this.bind('GotMilk', function() {
        showTextScene(["You found an old bottle of milk!!!!",
                       "It looks a little spoiled...",
                       "You drink it anyway...",
                       "You gain a surprising amount of courage."],
                       function() { Crafty.trigger('AnimateTrep'); });
    });
    
    this.bind('GotPoison', function() {
        showTextScene(["You find a bottle of... something...",
                       "It looks like it could be a potion...",
                       "You take a sip...",
                       "Oh no, it was poison!!",
                       "You lose some courage.",],
                       function() { Crafty.trigger('AnimateTrep'); });
    });
    
    this.bind('GotSocks', function() {
        showTextScene(["You find an old pair of socks!!",
                       "They look pretty comfortable...",
                       "You put them on...",
                       "Your feet are protected now!",
                       "Your defense points go up one.",]);
    });
    
    this.bind('GotBlanket', function() {
        showTextScene(["You found a blanket!!!!",
                       "It looks nice and cozy...",
                       "You take the blanket."]);
    });
    
    this.bind('MomTalk', function(mom) {
        if (!Crafty.storage('player_info').got_milk) {
            showTextScene(["Mom: You look so scared son...",
                           "Mom: Here take this milk.",
                           "You gain a little courage."],
                           function() { mom.animate('stop', 0); animateTrep(trep_points);});
        } else {
            showTextScene(["Mom: I'm all out of milk, son..."], function() { mom.animate('stop', 0); });
        }
    });
    
    this.bind('LumberjackTalk', function(lumberjack) {
        if (!Crafty.storage('player_info').got_axe) {
            showTextScene(["Jack: Thank you for killing the monster!",
                           "Jack: You can have my axe...",
                           "Jack: It's not the greatest...",
                           "Jack: But it works on dead trees.",
                           "You take the axe."],
                           function() { lumberjack.animate('stop', -1); });
        } else {
            showTextScene(["Jack: Hope the axe works..."], function() { lumberjack.animate('stop', -1); });
        }
    });
    
    this.bind('ChoppedTree', function(dead_tree) {
        showTextScene(["You chop down the tree."], function() { dead_tree.destroy(); });
    });
    
    this.bind('TownGuyTalk', function(town_guy) {
        var player_info = Crafty.storage('player_info');
        if (!player_info.got_scared && !player_info.fought_monster) {
            showTextScene(["Bob: There's scary monsters in those woods.",
                           "Bob: Just thought you should know...",
                           "You lose a little courage."],
                           function() { town_guy.animate('stop', 0); animateTrep(trep_points);});
        } else if (player_info.fought_monster && !player_info.got_scared) {
            if (!player_info.got_shield) {
                showTextScene(["Bob: Hey good job killing that monster...",
                               "Bob: I want you to have this shield...",
                               "Bob: Stay safe out there kid.",
                               "Your defense points go up one."],
                               function() { town_guy.animate('stop', 0); });
            } else {
                showTextScene(["Bob: How's the shield working out?",
                               ".........................",
                               "Bob: You're not very talkative, are you?"],
                               function() { town_guy.animate('stop', 0); });
            }
        } else if (!player_info.fought_monster && player_info.got_scared) {
            showTextScene(["Bob: Everything is still scary."],
                           function() { town_guy.animate('stop', 0); });
        }
    });
    
    this.bind('AnimateTrep', function(obj) {
        animateTrep(trep_points);
    });
    
    this.bind('StartFight', function(tp) {
        player.animate('PlayerFightingUp', -1);
        player.trep_points = tp;
        this.trigger('AnimateTrep');
    });
    
    this.bind('BossTalk', function() {
        var kill = player.fought_monster2 && player.fought_monster3 ?
                   "Greg: You killed all my friends!" :
                   "Greg: You are too weak to defeat me...";
        showTextScene(["Greg: Who dares enter my forest?!",
                       "Greg: Oh, it's you...",
                       kill,
                       "Greg: Now I'm going to kill you!"],
                       function() { sceneMusic("boss"); Crafty.storage("boss_fight", true); });
    });
    
    this.bind('DoneFighting', function () {
        player.fight_mode = false;
        player.animate('StopPlayerMovingUp', -1);
        player.trep_points = Crafty.storage('player_info').trep_points;
        Crafty.trigger("AnimateTrep");
        if (!player.fought_monster2 && !player.fought_monster3) {
            showTextScene(["You defeated a monster!!!", "You notice that darkness has fallen..."]);
        }
    });
    
    this.bind('WonGame', function () {
        player.fight_mode = false;
        sceneMusic("win");
        player.animate('StopPlayerMovingUp', -1);
        showTextScene(["You defeated the evil that was here!!",
                       "You saved everyone in the town.",
                       "Congratulations!!!!!!!!!!!!!"],
                       function() { Crafty.scene("TheEnd"); });
    });
    
}, function() {
	// Remove our event binding from above so that we don't
	//  end up having multiple redundant event watchers after
	//  multiple restarts of the game
	this.unbind('VillageVisited', this.show_victory);
});

Crafty.scene('InHouse', function() {
    var player_info = Crafty.storage('player_info');
    
	for (var x = 0; x < Game.map_grid.width; x++) {
		for (var y = 0; y < Game.map_grid.height; y++) {
            var at_edge = x == 0 || x == Game.map_grid.width - 1 || y == 0 || y == Game.map_grid.height - 1;
            var special_edge = y == Game.map_grid.height - 1 && x > 8 && x < 11;
			if (at_edge && !special_edge) {
				Crafty.e('HouseWall').at(x, y);
			} else if (special_edge) {
                Crafty.e('HouseOut').at(x, y);
                Crafty.e('LeaveHouse').at(x, y+1);
            } else {
                Crafty.e('HouseTile').at(x, y);
            }
		}
	}
    
    Crafty.e('Mom').at(3, 3);
    Crafty.e('Bed').at(12, 2);
    
    player = makePlayer().at(player_info.pos_x, player_info.pos_y).animate(player_info.dir, 0);
    trep_points = Crafty.e('TrepPoints');
    animateTrep(trep_points);
    
    text_back = Crafty.e('TextBack');
    bottom_text = Crafty.e('2D, DOM, Text')
            .attr({x: 0, y: 32*10.2, w: Game.width()})
            .textFont($text_css);
});

// Woods 1
Crafty.scene('Woods', function() {
    var player_info = Crafty.storage('player_info');
 
	non_trees = new Array(Game.map_grid.width);
	for (var i = 0; i < Game.map_grid.width; i++) {
		non_trees[i] = new Array(Game.map_grid.height);
		for (var y = 0; y < Game.map_grid.height; y++) {
			non_trees[i][y] = false;
		}
	}
    
    open_poss = [[9, 11],
                [10, 11],
                [9, 10],
                [10, 10],
                [8, 10],
                [7, 10],
                [6, 10],
                [6, 9],
                [7, 9],
                [6, 8],
                [7, 8],
                [6, 7],
                [7, 7],
                [8, 7],
                [9, 7],
                [10, 7],
                [11, 7],
                [12, 7],
                [13, 7],
                [14, 7],
                [15, 7],
                [16, 7],
                [15, 8],
                [16, 8],
                [15, 9],
                [16, 9], // sword
                [6, 6],
                [6, 5], // monster
                [6, 4],
                [6, 3],
                [5, 3],
                [5, 2], 
                [5, 1], 
                [6, 1], 
                [7, 1], 
                [8, 1], 
                [9, 1], 
                [9, 2], 
                [9, 3], 
                [9, 4], 
                [10, 4], 
                [11, 4], 
                [11, 3], // milk bottle
                [10, 3],
                [10, 2], 
                [10, 1], 
                [12, 4], 
                [13, 4], 
                [14, 4],
                [14, 3], 
                [14, 2],
                [14, 1],
                [14, 0], // out
            ]
                
    for (var i = 0; i < open_poss.length; i++) {
        non_trees[open_poss[i][0]][open_poss[i][1]] = true;
    }
    
    // Place a tree at every edge square on our grid of 16x16 tiles
	for (var x = 0; x < Game.map_grid.width; x++) {
		for (var y = 0; y < Game.map_grid.height; y++) {
			if (!non_trees[x][y]) {
				// Place a tree entity at the current tile
                var tree_color = Math.random();
                if (tree_color < 4/10) {
                    Crafty.e('RedTree').at(x, y);
                } else if (tree_color < 5/10) {
                    Crafty.e('YellowTree').at(x, y);
                } else {
                    Crafty.e('OrangeTree').at(x, y);
                }
			}
		}
	}
    
    if (!player_info.got_sword) {
        Crafty.e('Sword').at(16, 9);
    }
    
    if (!player_info.got_milk_bottle) {
        Crafty.e('MilkBottle').at(11, 3);
    }
    
    if (!player_info.fought_monster) {
        Crafty.e('Monster').at(6, 5);
    }
    
    Crafty.e('LeaveWoods').at(9, 12);
    Crafty.e('LeaveWoods').at(10, 12);
    Crafty.e('EnterWoods2').at(14, -1);
    
    player = makePlayer().at(player_info.pos_x, player_info.pos_y).animate(player_info.dir, 0);
    trep_points = Crafty.e('TrepPoints');
    animateTrep(trep_points);
    
    text_back = Crafty.e('TextBack');
    bottom_text = Crafty.e('2D, DOM, Text')
            .attr({x: 0, y: 32*10.2, w: Game.width()})
            .textFont($text_css);
     
    sceneMusic('scary');
});


// Woods 2
Crafty.scene('Woods2', function() {
    var player_info = Crafty.storage('player_info');
    
    // A 2D array to keep track of all occupied tiles
	non_trees = new Array(Game.map_grid.width);
	for (var i = 0; i < Game.map_grid.width; i++) {
		non_trees[i] = new Array(Game.map_grid.height);
		for (var y = 0; y < Game.map_grid.height; y++) {
			non_trees[i][y] = false;
		}
	}
    
    open_poss = [[14, 12],
                 [14, 11],
                 [14, 10],
                 [14, 9],
                 [13, 9],
                 [13, 8],
                 [12, 9],
                 [11, 9],
                 [10, 9],
                 [9, 9],
                 [8, 9],
                 [7, 9],
                 [6, 9],
                 [5, 9],
                 [5, 8],
                 [5, 7], // monster
                 [5, 6],
                 [5, 5],
                 [5, 4],
                 [4, 4],
                 [4, 5],
                 [3, 5],
                 [5, 3],
                 [4, 3],
                 [3, 3],
                 [3, 4],
                 [3, 2],
                 [4, 2], // lumberjack
                 [5, 2],
                 [14, 8],
                 [14, 7],
                 [14, 6],
                 [14, 5],
                 [15, 4],
                 [15, 3],
                 [15, 5],
                 [16, 5],
                 [16, 4],
                 [16, 3],
                 [16, 2],
                 [15, 2],
                 [14, 2],
                 [14, 1],
                 [13, 1],
                 [12, 1],
                 [11, 1],
                 [11, 2],
                 [11, 3],
                 [11, 4], // dead tree
                 [11, 5], // blanket
                 [10, 1],
                 [10, 2],
                 [9, 1],
                 [8, 1],
                 [8, 0],
                 [17, 5],
                 [18, 5],
                 [19, 5],
            ]
                
    for (var i = 0; i < open_poss.length; i++) {
        non_trees[open_poss[i][0]][open_poss[i][1]] = true;
    }
    
    // Place a tree at every edge square on our grid of 16x16 tiles
	for (var x = 0; x < Game.map_grid.width; x++) {
		for (var y = 0; y < Game.map_grid.height; y++) {
			if (!non_trees[x][y]) {
				// Place a tree entity at the current tile
                var tree_color = Math.random();
                if (tree_color < 4/10) {
                    Crafty.e('RedTree').at(x, y);
                } else if (tree_color < 5/10) {
                    Crafty.e('YellowTree').at(x, y);
                } else {
                    Crafty.e('OrangeTree').at(x, y);
                }
			}
		}
	}
    
    Crafty.e('LeaveWoods2').at(14, 12);
    Crafty.e('LeaveWoods2').at(15, 12);
    
    Crafty.e('EnterWoods3').at(20, 5);
    Crafty.e('EnterWoodsBoss').at(8, -1);
    
    Crafty.e('Lumberjack').at(4, 3);
    
    if (!player_info.chopped_tree) {
        Crafty.e('DeadTree').at(11, 4);
    }
    
    if (!player_info.got_blanket) {
        Crafty.e('Blanket').at(11, 5);
    }
    
    if (!player_info.fought_monster3) {
        Crafty.e('Monster3').at(5, 7);
    }
    
    player = makePlayer().at(player_info.pos_x, player_info.pos_y).animate(player_info.dir, 0);
    trep_points = Crafty.e('TrepPoints');
    animateTrep(trep_points);
    
    text_back = Crafty.e('TextBack');
    bottom_text = Crafty.e('2D, DOM, Text')
            .attr({x: 0, y: 32*10.2, w: Game.width()})
            .textFont($text_css);

    sceneMusic('scary2');
});


// Woods 3
Crafty.scene('Woods3', function() {
    var player_info = Crafty.storage('player_info');
    
    // A 2D array to keep track of all occupied tiles
	non_trees = new Array(Game.map_grid.width);
	for (var i = 0; i < Game.map_grid.width; i++) {
		non_trees[i] = new Array(Game.map_grid.height);
		for (var y = 0; y < Game.map_grid.height; y++) {
			non_trees[i][y] = false;
		}
	}
    
    open_poss = [[0, 5],
                 [1, 5],
                 [2, 5],
                 [3, 5],
                 [4, 5],
                 [5, 5],
                 [5, 6],
                 [5, 7],
                 [5, 8],
                 [6, 8],
                 [7, 8],
                 [8, 8],
                 [9, 8],
                 [10, 8],
                 [11, 8],
                 [11, 7],
                 [11, 6], // monster
                 [11, 5],
                 [11, 4],
                 [12, 4],
                 [13, 4],
                 [14, 4],
                 [14, 5],
                 [14, 6],
                 [14, 7],
                 [14, 8], // poison
                 [15, 6],
                 [15, 7],
                 [15, 8],
                 [16, 6], // socks
                 [16, 7],
                 [16, 8],]
                 
                
    for (var i = 0; i < open_poss.length; i++) {
        non_trees[open_poss[i][0]][open_poss[i][1]] = true;
    }
    
    // Place a tree at every edge square on our grid of 16x16 tiles
	for (var x = 0; x < Game.map_grid.width; x++) {
		for (var y = 0; y < Game.map_grid.height; y++) {
			if (!non_trees[x][y]) {
				// Place a tree entity at the current tile
                var tree_color = Math.random();
                if (tree_color < 4/10) {
                    Crafty.e('RedTree').at(x, y);
                } else if (tree_color < 5/10) {
                    Crafty.e('YellowTree').at(x, y);
                } else {
                    Crafty.e('OrangeTree').at(x, y);
                }
			}
		}
	}
    
    Crafty.e('LeaveWoods3').at(-1, 5);
    Crafty.e('LeaveWoods3').at(-1, 6);
    
    if (!player_info.got_socks) {
        Crafty.e('Socks').at(16, 6);
    }
    
    if (!player_info.got_poison) {
        Crafty.e('PoisonBottle').at(14, 8);
    }
    
    if (!player_info.fought_monster2) {
        Crafty.e('Monster2').at(11, 6);
    }
    
    player = makePlayer().at(player_info.pos_x, player_info.pos_y).animate(player_info.dir, 0);
    trep_points = Crafty.e('TrepPoints');
    animateTrep(trep_points);
    
    text_back = Crafty.e('TextBack');
    bottom_text = Crafty.e('2D, DOM, Text')
            .attr({x: 0, y: 32*10.2, w: Game.width()})
            .textFont($text_css);

    sceneMusic('scary3');
});


// Woods Boss
Crafty.scene('WoodsBoss', function() {
    var player_info = Crafty.storage('player_info');
    
    // A 2D array to keep track of all occupied tiles
	non_trees = new Array(Game.map_grid.width);
	for (var i = 0; i < Game.map_grid.width; i++) {
		non_trees[i] = new Array(Game.map_grid.height);
		for (var y = 0; y < Game.map_grid.height; y++) {
			non_trees[i][y] = true;
            if (i == 0 || i == 1 || i == Game.map_grid.width - 1 || i == Game.map_grid.width - 2 || 
                y == 0 || y == 1 || y == Game.map_grid.height - 1 || y == Game.map_grid.height - 2) {
                non_trees[i][y] = false;
            }
		}
	}
    
    open_poss = [[8, 11], [9, 11], [8, 10], [9, 10]];
                
    for (var i = 0; i < open_poss.length; i++) {
        non_trees[open_poss[i][0]][open_poss[i][1]] = true;
    }
    
    // Place a tree at every edge square on our grid of 16x16 tiles
	for (var x = 0; x < Game.map_grid.width; x++) {
		for (var y = 0; y < Game.map_grid.height; y++) {
			if (!non_trees[x][y]) {
				// Place a tree entity at the current tile
                var tree_color = Math.random();
                if (tree_color < 4/10) {
                    Crafty.e('RedTree').at(x, y);
                } else if (tree_color < 5/10) {
                    Crafty.e('YellowTree').at(x, y);
                } else {
                    Crafty.e('OrangeTree').at(x, y);
                }
			}
		}
	}
    
    Crafty.e('LeaveWoodsBoss').at(8, 12);
    Crafty.e('LeaveWoodsBoss').at(9, 12);
    
    Crafty.e("BigMonster").at(8, 4);
    
    player = makePlayer().at(player_info.pos_x, player_info.pos_y).animate(player_info.dir, 0);
    trep_points = Crafty.e('TrepPoints');
    animateTrep(trep_points);
    
    text_back = Crafty.e('TextBack');
    bottom_text = Crafty.e('2D, DOM, Text')
            .attr({x: 0, y: 32*10.2, w: Game.width()})
            .textFont($text_css);

    sceneMusic('scary2');
});

Crafty.scene('Loading', function () {
    // Draw some text for the player to see in case the file
    // takes a noticeable amount of time to load
    Crafty.e('2D, DOM, Text')
        .text('Loading; please wait...')
        .attr({x: 0, y: Game.height() / 2 - 24, w: Game.width()})
        .textFont($text_css);

    // Load our sprite map image
    Crafty.load({
        "images": [
            'assets/16x16_forest_2.gif',
            'assets/hunter.png',
            'assets/guy_sheet2.png',
            'assets/red_tree.png',
            'assets/yellow_tree.png',
            'assets/orange_tree.png',
            'assets/text_back1.png',
            'assets/trep_points.png',
            'assets/sword.png',
            'assets/town_hall.png',
            'assets/house.png',
            'assets/house_bottom.png',
            'assets/house_tile.png',
            'assets/house_wall.png',
            'assets/house_out.png',
            'assets/mom.png',
            'assets/monster.png',
            'assets/town_guy.png',
            'assets/guy_bed.png',
            'assets/milk_bottle.png',
            'assets/lumberjack.png',
            'assets/dead_tree.png',
            'assets/blanket.png',
            'assets/blinky.png',
            'assets/chompy.png',
            'assets/socks.png',
            'assets/poison_bottle.png',
            'assets/big_monster.png',
        ],
        "audio": {
            scary: 'assets/scary.mp3',
            scary2: 'assets/scary2.mp3',
            scary3: 'assets/scary3.mp3',
            boss: 'assets/boss.mp3',
            dead: 'assets/dead.mp3',
            win: 'assets/win.mp3',
            knock: [
                'assets/door_knock_3x.mp3',
                'assets/door_knock_3x.ogg',
                'assets/door_knock_3x.aac'
            ],
            applause: [
                'assets/board_room_applause.mp3',
                'assets/board_room_applause.ogg',
                'assets/board_room_applause.aac'
            ],
            ring: [
                'assets/candy_dish_lid.mp3',
                'assets/candy_dish_lid.ogg',
                'assets/candy_dish_lid.aac'
            ]}
        }, function () {
        // Once the images are loaded...

        Crafty.sprite(32, 'assets/red_tree.png', {
            spr_red_tree: [0, 0]
        });
        
        Crafty.sprite(32, 'assets/yellow_tree.png', {
            spr_yellow_tree: [0, 0]
        });
        
        Crafty.sprite(32, 'assets/orange_tree.png', {
            spr_orange_tree: [0, 0]
        });
        
        Crafty.sprite(448, 'assets/text_back1.png', {
            spr_text_back: [0, 0]
        });
        
        Crafty.sprite(103, 32, 'assets/trep_points.png', {
            spr_trep_points: [0, 0]
        });
        
        Crafty.sprite(32, 'assets/sword.png', {
            spr_sword: [0, 0]
        });
        
        Crafty.sprite(128, 96, 'assets/town_hall.png', {
            spr_hall: [0, 0]
        });
        
        Crafty.sprite(128, 96, 'assets/house.png', {
            spr_house: [0, 0]
        });
        
        Crafty.sprite(54, 4, 'assets/house_bottom.png', {
            spr_bot_left: [0, 0]
        });
        
        Crafty.sprite(22, 4, 'assets/house_bottom.png', {
            spr_bot_right: [0, 0]
        });
        
        Crafty.sprite(40, 2, 'assets/house_bottom.png', {
            spr_door: [0, 0]
        });
        
        Crafty.sprite(32, 32, 'assets/house_tile.png', {
            spr_tile: [0, 0]
        });
        
        Crafty.sprite(32, 32, 'assets/house_wall.png', {
            spr_wall: [0, 0]
        });
        
        Crafty.sprite(32, 32, 'assets/house_out.png', {
            spr_house_out: [0, 0]
        });
        
        Crafty.sprite(32, 32, 'assets/mom.png', {
            spr_mom: [0, 0]
        });
        
        Crafty.sprite(32, 32, 'assets/monster.png', {
            spr_monster: [0, 0]
        });
        
        Crafty.sprite(32, 32, 'assets/town_guy.png', {
            spr_town_guy: [0, 0]
        });
        
        Crafty.sprite(64, 64, 'assets/guy_bed.png', {
            spr_bed: [0, 0]
        });
        
        Crafty.sprite(32, 32, 'assets/milk_bottle.png', {
            spr_milk_bottle: [0, 0]
        });
        
        Crafty.sprite(32, 32, 'assets/lumberjack.png', {
            spr_lumberjack: [0, 0]
        });
        
        Crafty.sprite(32, 32, 'assets/dead_tree.png', {
            spr_dead_tree: [0, 0]
        });
        
        Crafty.sprite(32, 32, 'assets/blanket.png', {
            spr_blanket: [0, 0]
        });
        
        Crafty.sprite(64, 64, 'assets/blinky.png', {
            spr_blinky: [0, 0]
        });
        
        Crafty.sprite(32, 32, 'assets/chompy.png', {
            spr_chompy: [0, 0]
        });
        
        Crafty.sprite(32, 32, 'assets/socks.png', {
            spr_socks: [0, 0]
        });
        
        Crafty.sprite(32, 32, 'assets/poison_bottle.png', {
            spr_poison_bottle: [0, 0]
        });
        Crafty.sprite(64, 64, 'assets/big_monster.png', {
            spr_big_monster: [0, 0]
        });

        Crafty.sprite(32, 'assets/guy_sheet2.png', {
            spr_player: [0, 1],
        }, 0, 0);

        // Now that our sprites are ready to draw, start the game
        Crafty.scene('Menu');
    });
});

Crafty.scene('Menu', function() {
    Crafty.e('2D, DOM, Text')
          .text('Use the arrow keys to move.')
          .attr({x: 0, y: Game.height() / 2 - 24, w: Game.width()})
          .textFont($text_css);
    Crafty.e('2D, DOM, Text')
          .text('Use the ENTER key for everything else.')
          .attr({x: 0, y: Game.height() / 2, w: Game.width()})
          .textFont($text_css);
    Crafty.e('2D, DOM, Text')
          .text('Press the ENTER key to begin.')
          .attr({x: 0, y: Game.height() / 2 + 48, w: Game.width()})
          .textFont($text_css);
          
    Crafty.bind('KeyDown', function(e) {
        if (e.key == Crafty.keys.ENTER) {
            Crafty.unbind('KeyDown');
            Crafty.scene("Game");
        }
    });
});

Crafty.scene('Dead', function() {
    Crafty.background('#000');
    Crafty.e('2D, DOM, Text')
          .text('You got too scared and went insane. refresh to try again')
          .attr({x: 0, y: Game.height() / 2 - 24, w: Game.width()})
          .textFont($text_css);
          
    sceneMusic("dead");
});

Crafty.scene('TheEnd', function() {
    Crafty.background('#000');
    Crafty.e('2D, DOM, Text')
          .text('THE END')
          .attr({x: 0, y: Game.height() / 2 - 24, w: Game.width()})
          .textFont($text_css);
          
    sceneMusic("win");
});
        