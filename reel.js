function Reel(strip, num) {
	PIXI.Container.call(this);
	this.reelstrip = strip;
	this.reelstripConcat = [];
	this.reelNum = num;
	this.texturesArray = [];
	this.spritesArray = [];
	this.vy = null;
	this.stopNum = null;
	this.expectation = null;
	this.state = null;
	this.widthElement = 198;
	this.heightElement = 168;
}
Reel.prototype = Object.create(PIXI.Container.prototype);
Reel.prototype.constructor = Reel;

Reel.prototype.init = function () {
	var rectangle = new PIXI.Graphics();
	rectangle.drawRect(0, 0, this.widthElement, reelPanel.height - 20);
	this.mask = rectangle;
	this.addChild(rectangle);
	for (var i = 0; i < 9; i++) {
		var arr = [];
		for (var j = 0; j < 11; j++) {
			var texture = resources["gsym"].textures["gsym_" + i + "_" + j];
			arr.push(texture);
		};
		this.texturesArray.push(arr);
	};
	for (var c = 0; c < 4; c++) {
		var sprite = new PIXI.extras.AnimatedSprite(this.texturesArray[this.reelstrip[c]]);
		sprite.anchor.set(0.5, 0.5);
		sprite.y = this.heightElement * c - this.heightElement / 2;
		sprite.x = this.widthElement / 2;
		sprite.animationSpeed = 0.5;
		sprite.loop = false;
		this.addChild(sprite);
		this.spritesArray.push(sprite);
	};
	var doubleArr = this.reelstrip.concat(this.reelstrip);
	var last = this.reelstrip[this.reelstrip.length - 1];
	var prelast = this.reelstrip[this.reelstrip.length - 2];
	this.reelstripConcat = [prelast, last, ...doubleArr];
};

Reel.prototype.spin = function () {
	for (var i = 0; i < this.spritesArray.length; i++) {
		this.spritesArray[i].y += this.vy;
	};
	if (this.expectation >= this.stopNum && this.spritesArray[0].y > this.heightElement / 2) {
		this.spritesArray.unshift(this.spritesArray.pop());
		this.spritesArray[0].y = this.spritesArray[1].y - this.heightElement;
		this.spritesArray[0].textures = this.texturesArray[this.reelstripConcat[this.expectation]];
		this.spritesArray[0].updateTexture();
		if (this.spritesArray[0].textures === this.texturesArray[8]) {
			this.setChildIndex(this.spritesArray[0], this.children.length - 1);
		};
		this.expectation -= 1;
	};
};

Reel.prototype.stop = function () {
	if (this.expectation < this.stopNum && this.spritesArray[2].y > reelPanel.height / 2 - 11 && this.spritesArray[2].y <= reelPanel.height / 2 + 13 && this.vy > 0) {
		this.state = 1;
		this.vy = 12;
		this.spin();
	} else if (this.expectation < this.stopNum && this.spritesArray[2].y > reelPanel.height / 2 - 11 && this.vy !== 0) {
		this.vy = -4;
		this.spin();
	} else if (this.expectation < this.stopNum && this.spritesArray[2].y === reelPanel.height / 2 - 11 && this.vy < 0) {
		this.vy = 0;
		this.state = 2;
	} else { this.spin() };
};

Reel.prototype.randomInt = function () {
	this.stopNum = Math.floor(Math.random() * this.reelstrip.length);
	this.expectation = this.stopNum + this.reelNum * 5;
};