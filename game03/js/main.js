var game = new Phaser.Game(800, 600, Phaser.AUTO);

var Game = function(game){};
Game.prototype = {
	preload: function(){
		//load assets
		game.load.image('background', 'assets/img/background.png');
		game.load.atlas('atlas', 'assets/img/spritesheet.png', 'assets/img/sprites.json')
	},
	create: function(){
		this.background = game.add.sprite(0, 0, 'background');
		for(var x = 0; x < 50; x++) {
			armada = new Armada(game, 'atlas', 'spaceship');
			game.add.existing(armada);
		}
	},
	update: function(){
	}
}

//add states to game, set starting state
game.state.add('Game', Game);
game.state.start('Game');