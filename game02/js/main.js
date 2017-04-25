var game = new Phaser.Game(800, 480, Phaser.AUTO);
var score = 0;
var scoreText;
var speed = 5;
var timer = 0;
var rockTimer = 0;
var best = 0;

var MainMenu = function(game){};
MainMenu.prototype = {
	preload: function(){
		//load assets
		this.game.load.image('background', 'assets/img/background.png');
		this.game.load.atlas('planes', 'assets/img/spritesheet.png', 'assets/img/sprites.json');
		this.game.load.audio('loop', ['assets/audio/loop.mp3', 'assets/audio/loop.ogg']);

	},
	create: function(){
		this.game.add.sprite(0, 0, 'background'); //add background
		this.overtext = game.add.sprite(400, 100, 'planes', 'textGetReady'); //add GetReady text
        this.overtext.anchor.set(0.5); //set center point of sprite

        game.add.text(250, 165, 'Press space to play', {fontSize: '32px', fill: '#000'});


        //Loading instruction assets
        this.demoPlayer = game.add.sprite(150, 300, 'planes', 'planeRed1');
        this.demoPlayer.animations.add('move', Phaser.Animation.generateFrameNames('planeRed', 1, 3), 30, true);
		this.demoPlayer.animations.play('move'); //play animation

		game.add.sprite(346, 300, 'planes', 'rockGrass');
		game.add.sprite(600, 320, 'planes', 'starGold');

		game.add.text(140, 250, 'Space to Jump', {fontSize: '16px', fill: '#000'});
		game.add.text(386, 250, 'Dodge', {fontSize: '16px', fill: '#000'});
		game.add.text(590, 250, 'Collect', {fontSize: '16px', fill: '#000'});

		//play music
        music = game.add.audio('loop');
        music.loop = true;
        music.volume = 0.5;
    	music.play();
	},
	update: function(){
		//spacebar press to go to next state
		if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
			console.log('Goto Game');
			game.state.start('Game');
		}
	}
}

var Game = function(game){};
Game.prototype = {
	preload: function(){
		//load assets for game
    	game.load.audio('crash', 'assets/audio/crash.wav');
    	game.load.audio('jump', 'assets/audio/jump.wav');
    	game.load.audio('collect', 'assets/audio/coin.wav');
	},
	create: function(){

		this.game.physics.startSystem(Phaser.Physics.ARCADE);

		this.background = game.add.tileSprite(0, 0, 800, 480, 'background'); //add scrolling background
		this.foreground = game.add.tileSprite(0, 411, 800, 311, 'planes', 'groundGrass'); //add scrolling foreground

		//display score in corner
		scoreText = game.add.text(16, 16, 'Score: 0', {fontSize: '32px', fill: '#000'});
		score = 0;
		speed = 5;
		timer = 0;
		rockTimer = 0;

		//display record text
		bestText = game.add.text(16, 48, 'Best: ' + best, {fontSize: '32px', fill: '#000'});

		//add player to game
		this.player = game.add.sprite(100, 100, 'planes'); 
		this.player.anchor.set(0.5);

		//create animation from planes atlas
		this.player.animations.add('move', Phaser.Animation.generateFrameNames('planeRed', 1, 3), 30, true);
		this.player.animations.play('move'); //play animation

		//give player physics properties
		this.game.physics.arcade.enable(this.player);
		this.player.body.collideWorldBounds = true;
		this.player.body.gravity.y = 500;
		this.player.body.maxVelocity.y = 500;
		this.player.body.angularDrag = 1;
		this.player.body.setSize(70, 50, 10, 12); //modify collision box

		//create stars group
		this.stars = game.add.group();
		this.stars.enableBody = true;

		//create rocks group
		this.rocks = game.add.group();
		this.rocks.enableBody = true;

		//load sound effects
		crash = game.add.audio('crash');
		crash.volume = 0.5;
		jump = game.add.audio('jump');
		jump.volume = 0.4;
		collect = game.add.audio('collect');

	},
	update: function(){
		this.background.tilePosition.x -= 1; //scroll background
		this.foreground.tilePosition.x -= speed; //scroll foreground

		//adjust every star's rotation and position
		this.stars.forEach(function(star) {
			star.x -= speed;
			star.angle += 1;
			if (star.x < -50)
				star.kill(); //if it exits screen, delete it
		}, this);

		//adjust every rock's position
		this.rocks.forEach(function(rock) {
			rock.x -= speed;
			if (rock.x < -50) //if it exits screen, delete it
				rock.kill();
		}, this);

		this.player.body.angularVelocity = 60; //change angle of plane

		//randomly spawn stars based on a timer
		if(timer < 50 + (Math.random() * 300))
			timer++;
		else{
			timer = 0;
			var star = this.stars.create(810, 20 + (Math.random() * (game.world.height - 150)), 'planes', 'starGold');
			star.anchor.set(0.5); //set center point of sprite
		}

		//randomly spawn rocks based on a timer
		if(rockTimer < 50 + (Math.random() * 300))
			rockTimer++;
		else{
			rockTimer = 0;
			selectRock = Math.round(Math.random()); //choose top or bottom rock
			if(selectRock)
				var rock = this.rocks.create(810, 350 + (Math.random() * 100), 'planes', 'rockGrass');
			else
				var rock = this.rocks.create(810, 0 + (Math.random() * 100), 'planes', 'rockDown');
			rock.body.setSize(10, 239, 49, 0);
			rock.anchor.set(0.5); //set center point of sprite
		}

		if(this.player.y > 389){
			game.state.start('GameOver');
			crash.play();
		}


		game.physics.arcade.overlap(this.player, this.stars, this.collectStar, null, this); //enable plane-star collision

		game.physics.arcade.overlap(this.player, this.rocks, this.hitRock, null, this); //enable collision with rocks

		//spacebar press to go to next state
		if(game.input.keyboard.isDown(Phaser.Keyboard.G)){
			console.log('Goto GameOver');
			game.state.start('GameOver');
		}

		//jump controls
		this.jumpKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		if(this.jumpKey.justPressed()){
			jump.play(); //play sound
			this.player.body.velocity.y -= 400;
			this.player.angle = -45;
		}

		//adjust speed based on points, increases as points increase
		if (speed < 16)
			speed = (score/6) + 5;

	},
	collectStar: function(player, star){
			collect.play();
			star.kill(); //destroy star
			score += 1; //add to score
			scoreText.text = 'Score: ' + score; //change displayed score text
	},
	hitRock: function(player, rock){
			game.state.start('GameOver');
			crash.play();
	},
	render: function(){
		 // this.rocks.forEach(function(rock) {
		 // 	this.game.debug.body(rock);
		 // }, this);

		 // this.game.debug.body(this.player);
	}

}

var GameOver = function(game){};
GameOver.prototype = {
    preload: function(){
    	
    },
    create: function(){
		this.game.add.sprite(0, 0, 'background'); //add background
        this.overtext = game.add.sprite(400, 100, 'planes', 'textGameOver'); //add GameOver text
        this.overtext.anchor.set(0.5); //set center of sprite
        game.add.text(210, 165, 'Press space to play again', {fontSize: '32px', fill: '#000'});
        if (score > best)
        	best = score;

    },
    update: function(){
		//spacebar press to go to next state
    	if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
    		music.pause();
			console.log('Goto MainMenu');
			game.state.start('MainMenu');
		}
    }
}

//add states to game, set starting state
game.state.add('MainMenu', MainMenu);
game.state.add('Game', Game);
game.state.add('GameOver', GameOver);
game.state.start('MainMenu');
