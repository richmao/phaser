var game = new Phaser.Game(800, 480, Phaser.AUTO);

var Game = function(game){};
Game.prototype = {
	preload: function(){
		//load assets for game

	},
	create: function(){

		this.game.physics.startSystem(Phaser.Physics.ARCADE);

		this.background = game.add.tileSprite(0, 0, 800, 480, 'background'); //add scrolling background
	},
	update: function(){
		//adjust every star's rotation and position
		this.stars.forEach(function(star) {
			star.x -= speed;
			star.angle += 1;
			if (star.x < -50)
				star.kill(); //if it exits screen, delete it
		}, this);
	}
}

//add states to game, set starting state
game.state.add('Game', Game);
game.state.start('Game');
