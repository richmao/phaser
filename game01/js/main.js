var game = new Phaser.Game(500, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });
var platforms;
var score = 0;
var scoreText;

function preload() {
	// preload assets
	game.load.image('sky', 'assets/img/sky.png');
	game.load.image('ground', 'assets/img/platform.png');
	game.load.image('star', 'assets/img/star.png');
	game.load.image('diamond', 'assets/img/diamond.png');
	game.load.spritesheet('baddie', 'assets/img/baddie.png', 32, 32);
	game.load.spritesheet('dude', 'assets/img/dude.png', 32, 48);
}

function create() {
	// Enable Physics in arcade
	game.physics.startSystem(Phaser.Physics.ARCADE);

	//create sky background
	game.add.sprite(0, 0, 'sky');

	//create a group for platforms
	platforms = game.add.group();
	platforms.enableBody = true;

	//add ground to platform group
	var ground = platforms.create(0, game.world.height - 64, 'ground');
	ground.scale.setTo(2, 2);
	ground.body.immovable = true; //set unaffected by physics

	//add ledges to platform group
	var ledge = platforms.create(400, 175, 'ground');
	ledge.body.immovable = true; //set unaffected by physics
	ledge = platforms.create(100, 100, 'ground');
	ledge.scale.setTo(0.5, 1);
	ledge.body.immovable = true; //set unaffected by physics
	ledge = platforms.create(-200, 450, 'ground');
	ledge.body.immovable = true; //set unaffected by physics
	ledge = platforms.create(-150, 250, 'ground');
	ledge.body.immovable = true; //set unaffected by physics
	ledge = platforms.create(300, 350, 'ground');
	ledge.body.immovable = true; //set unaffected by physics

	//create player
	player = game.add.sprite(32, game.world.height - 125, 'baddie');
	game.physics.arcade.enable(player); //enable physics on player
	player.body.bounce.y = 0.2;
	player.body.gravity.y = 300;
	player.body.collideWorldBounds = true;

	//create left and right animations for player using spritesheet
	player.animations.add('left', [0, 1], 10, true);
	player.animations.add('right', [2, 3], 10, true);

	//enable built in key controls
	cursors = game.input.keyboard.createCursorKeys();

	//create stars group
	stars = game.add.group();
	stars.enableBody = true; //enable physics on stars group

	//create 12 stars in stars group
	for(var i = 0; i < 12; i++){
		var star = stars.create(i * 41.6, 0, 'star');
		star.body.gravity.y = 6;
		star.body.bounce.y = 0.7 + Math.random() * 0.2; //set random bounce
	}

	//create diamond
	diamond = game.add.sprite(Math.random() * (game.world.width - 32), Math.random() * (game.world.height - 75), 'diamond');
	game.physics.arcade.enable(diamond); //enable physics on diamond
	diamond.body.gravity.y = 100;
	diamond.body.bounce.y = 0.1;

	//display score in corner
	scoreText = game.add.text(16, 16, 'Score: 0', {fontSize: '32px', fill: '#000'});
}

function update() {
	//create collision between player and platform
	var hitPlatform = game.physics.arcade.collide(player, platforms);

	player.body.velocity.x = 0; //player does not move horizontally unless keys pressed

	//player movement for key presses
	if(cursors.left.isDown){
		player.body.velocity.x = -150; //move left
		player.animations.play('left'); //left animation
	}
	else if(cursors.right.isDown){
		player.body.velocity.x = 150; //move right
		player.animations.play('right'); //right animation
	}
	else{
		player.animations.stop(); //no animation when still
		player.frame = 2; //default still frame
	}

	//enable jumping
	if(cursors.up.isDown && player.body.touching.down && hitPlatform){
		player.body.velocity.y = -350;
	}

	//enable collision between stars and platforms
	game.physics.arcade.collide(stars, platforms);

	//run collectStar when player and stars collide
	game.physics.arcade.overlap(player, stars, collectStar, null, this);

	//enable collision between diamond and platforms
	game.physics.arcade.collide(diamond, platforms);

	//run collectDiamond when player and dianmod collide
	game.physics.arcade.overlap(player, diamond, collectDiamond, null, this);
}

function collectStar(player, star){
	star.kill(); //destroy star
	score += 10; //add to score
	scoreText.text = 'Score: ' + score; //change displayed score text
}

function collectDiamond(player, diamond){
	diamond.kill(); //destroy diamond
	score += 25; //add to score
	scoreText.text = 'Score: ' + score; //change displayed score text
}