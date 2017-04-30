function Armada(game, key, frame) {
	Phaser.Sprite.call(this, game, game.rnd.integerInRange(64, game.width-64), game.rnd.integerInRange(64, game.height-61), key, frame);

	this.anchor.set(0.5);
	var s = Math.random() + 0.5;
	this.scale.x = s;
	this.scale.y = s;

	game.physics.enable(this);
	this.body.velocity.x = game.rnd.integerInRange(50, 200);
}

//add to constructor to Armada prototype
Armada.prototype = Object.create(Phaser.Sprite.prototype);
Armada.prototype.constructor = Armada;

//override default update function
Armada.prototype.update = function() {
	//switch direction when R is pressed
	this.key = game.input.keyboard.addKey(Phaser.Keyboard.R);
	if(this.key.justPressed()){
		this.body.velocity.x = -this.body.velocity.x;
		this.angle = this.angle - 180;
	}
	
	//wrap around screen
	if(this.x < 0 - this.width/2)
		this.x = game.width + this.width/2;
	else if(this.x > game.width + this.width/2)
		this.x = 0 - this.width/2;
}