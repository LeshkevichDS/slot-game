var width = 1280,
	height = 720,
	loader = PIXI.loader,
	resources = loader.resources,
	renderer = new PIXI.autoDetectRenderer(width, height, { view: document.getElementById("canvas") }),
	stage = new PIXI.Container(),
	gameState = null,
	ticker = null,
	reelPanel = null,
	reel1 = null,
	reel2 = null,
	reel3 = null,
	animationArray = [],
	paytable = null,
	paytableArray = [40, 20, 16, 16, 2, 2, 2, 2, 50],
	wfd = null,
	score = 0,
	playButton = null,
	textureButtonUp = null,
	textureButtonDown = null,
	textureButtonDraw = null,
	reelstrip1 = [
		0, //Seven
		1, //Bar
		2, //Melon
		3, //Grapes
		4, //Plum
		5, //Orange
		6, //Lemon
		7, //Cherry
		8, //Star
		0, //Seven
		2, //Melon
		4, //Plum
		6, //Lemon
		1, //Bar
		3, //Grapes
		5, //Orange
		7, //Cherry
		8, //Star
	],
	reelstrip2 = [
		0, //Seven
		1, //Bar
		1, //Bar
		2, //Melon
		3, //Grapes
		4, //Plum
		6, //Lemon
		6, //Lemon
		7, //Cherry
		8, //Star
		0, //Seven
		2, //Melon
		4, //Plum
	],
	reelstrip3 = [
		0, //Seven
		0, //Seven
		8, //Star
		3, //Grapes
		4, //Plum
		5, //Orange
		6, //Lemon
		7, //Cherry
		7, //Cherry
		2, //Melon
		4, //Plum
		2, //Melon
		6, //Lemon
		1, //Bar
		1, //Bar
		3, //Grapes
		5, //Orange
		7, //Cherry
		7, //Cherry
		2, //Melon
	];

loader
	.add('bgr', 'images/bgr.png')
	.add('paytable', 'images/paytable.png')
	.add('logo', 'images/logo.png')
	.add('wfd', 'images/wfd.png')
	.add('reels', 'images/reels.png')
	.add('gsym', 'images/gsym.json')
	.add('btn', 'images/btn.png')
	.add('btn_pressed', 'images/btn_pressed.png')
	.add('ico_play', 'images/ico_play.png')
	.add('win_font', 'images/win_font.fnt')
	.load(onAssetsLoaded);

function onAssetsLoaded() {
	init();
}

function init() {
	var bgr = new PIXI.Sprite(resources.bgr.texture);
	stage.addChild(bgr);

	var screenContainer = new PIXI.Container();
	stage.addChild(screenContainer);

	reelPanel = new PIXI.Sprite(resources.reels.texture);
	screenContainer.addChild(reelPanel);

	reel1 = new Reel(reelstrip1, 1);
	reel1.init();
	reel1.position.set(
		10,
		10
	);
	screenContainer.addChild(reel1);

	reel2 = new Reel(reelstrip2, 2);
	reel2.init();
	reel2.position.set(
		218,
		10
	);
	screenContainer.addChild(reel2);

	reel3 = new Reel(reelstrip3, 3);
	reel3.init();
	reel3.position.set(
		426,
		10
	);
	screenContainer.addChild(reel3);

	screenContainer.position.set(width / 2 - reelPanel.width / 2, height / 2 - reelPanel.height / 2);

	paytable = new Paytable(paytableArray);
	paytable.position.set(
		screenContainer.x / 2 - paytable.width / 2,
		height / 2 - paytable.height / 2
	);
	stage.addChild(paytable);

	var logo = new PIXI.Sprite(resources.logo.texture);
	logo.position.set(
		width / 2 - logo.width / 2,
		screenContainer.y - logo.height
	);
	stage.addChild(logo);

	winPanel = new WinPanel();
	winPanel.position.set(
		width / 2 - winPanel.wfd.width / 2,
		screenContainer.y - this.winPanel.height
	);
	stage.addChild(winPanel);
	winPanel.visible = false;

	textureButtonUp = resources.btn.texture;
	textureButtonDown = resources.btn_pressed.texture;
	textureButtonDraw = resources.ico_play.texture;
	playButton = new Button(textureButtonUp, textureButtonDown, textureButtonDraw, onPlayButtonDown);
	playButton.init();
	playButton.position.set(
		width - (width - (screenContainer.x + screenContainer.width)) / 2 - playButton.width / 2,
		height / 2 - playButton.height / 2
	);
	stage.addChild(playButton);

	ticker = PIXI.ticker.shared;
	ticker.add(render);
};

function render() {
	renderer.render(stage);
};

function play() {
	reel1.stop();
	reel2.stop();
	reel3.stop();
	if (reel1.state === 2 && reel2.state === 2 && reel3.state === 2) {
		win();
		reel1.state = null;
		reel2.state = null;
		reel3.state = null;
		gameState = null;
		ticker.remove(play);
	};
};

function onPlayButtonDown() {
	if (gameState === null) {
		playButton.btn.texture = textureButtonDown;
		for (var i = 1; i < 4; i++) {
			reel1.spritesArray[i].gotoAndStop(0);
			reel2.spritesArray[i].gotoAndStop(0);
			reel3.spritesArray[i].gotoAndStop(0);
		};
		reel1.randomInt();
		reel2.randomInt();
		reel3.randomInt();
		reel1.vy = 24;
		reel2.vy = 24;
		reel3.vy = 24;
		gameState = 1;
		animationArray = [];
		winPanel.counter = -1;
		ticker.remove(playAnimation);
		ticker.add(play);

	} else if (gameState === 1 && reel1.state === null && reel2.state === null && reel3.state === null) {
		playButton.btn.texture = textureButtonDown;
		reel1.expectation = reel1.stopNum + 3;
		reel2.expectation = reel2.stopNum + 3;
		reel3.expectation = reel3.stopNum + 3;
		reel1.vy = 48;
		reel2.vy = 48;
		reel3.vy = 48;
		gameState = 2;
	} else if (gameState === 1 && reel2.state === null && reel3.state === null) {
		playButton.btn.texture = textureButtonDown;
		reel2.expectation = reel2.stopNum + 3;
		reel3.expectation = reel3.stopNum + 3;
		reel2.vy = 48;
		reel3.vy = 48;
		gameState = 2;
	} else if (gameState === 1 && reel3.state === null) {
		playButton.btn.texture = textureButtonDown;
		reel3.expectation = reel3.stopNum + 3;
		reel3.vy = 48;
		gameState = 2;
	};
};

function win() {
	var winState = false;
	if (reel1.spritesArray[1].texture === reel2.spritesArray[1].texture && reel2.spritesArray[1].texture === reel3.spritesArray[1].texture) {
		animationArray.push([reel1.spritesArray[1], reel2.spritesArray[1], reel3.spritesArray[1]]);
		score += paytableArray[reel1.texturesArray.indexOf(reel1.spritesArray[1].textures)];
		winState = true;
	};
	if (reel1.spritesArray[2].texture === reel2.spritesArray[2].texture && reel2.spritesArray[2].texture === reel3.spritesArray[2].texture) {
		animationArray.push([reel1.spritesArray[2], reel2.spritesArray[2], reel3.spritesArray[2]]);
		score += paytableArray[reel1.texturesArray.indexOf(reel1.spritesArray[2].textures)];
		winState = true;
	};
	if (reel1.spritesArray[3].texture === reel2.spritesArray[3].texture && reel2.spritesArray[3].texture === reel3.spritesArray[3].texture) {
		animationArray.push([reel1.spritesArray[3], reel2.spritesArray[3], reel3.spritesArray[3]]);
		score += paytableArray[reel1.texturesArray.indexOf(reel1.spritesArray[3].textures)];
		winState = true;
	};
	if (reel1.spritesArray[1].texture === reel2.spritesArray[2].texture && reel2.spritesArray[2].texture === reel3.spritesArray[3].texture) {
		animationArray.push([reel1.spritesArray[1], reel2.spritesArray[2], reel3.spritesArray[3]]);
		score += paytableArray[reel1.texturesArray.indexOf(reel1.spritesArray[1].textures)];
		winState = true;
	};
	if (reel1.spritesArray[3].texture === reel2.spritesArray[2].texture && reel2.spritesArray[2].texture === reel3.spritesArray[1].texture) {
		animationArray.push([reel1.spritesArray[3], reel2.spritesArray[2], reel3.spritesArray[1]]);
		score += paytableArray[reel1.texturesArray.indexOf(reel1.spritesArray[3].textures)];
		winState = true;
	};
	if (winState) {
		ticker.add(playAnimation);
		winPanel.counter = 0;
		ticker.add(totalScore);
	};
};

function playAnimation() {
	if (!animationArray[animationArray.length - 1][2].playing) {
		for (var j = 0; j < 3; j++) {
			animationArray[0][j].gotoAndPlay(0);
		};
		animationArray.push(animationArray.shift());
	};
};

function totalScore() {
	winPanel.totalScore();
};