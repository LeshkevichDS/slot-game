function Button(textureButtonUp, textureButtonDown, textureButtonDraw, funcButtonDown) {
    PIXI.Container.call(this);
    this.btn = null;
    this.btnDraw = null;
    this.textureUp = textureButtonUp;
    this.textureDown = textureButtonDown;
    this.textureDraw = textureButtonDraw;
    this.funcDown = funcButtonDown;
};
Button.prototype = Object.create(PIXI.Container.prototype);
Button.prototype.constructor = Button;

Button.prototype.init = function () {
    this.btn = new PIXI.Sprite(this.textureUp);
    this.addChild(this.btn);

    this.btnDraw = new PIXI.Sprite(this.textureDraw);
    this.btnDraw.anchor.set(0.5, 0.5);
    this.btnDraw.position.set(this.width / 2, this.height / 2);
    this.addChild(this.btnDraw);

    this.btn.interactive = true;
    this.btn.on("mousedown", this.funcDown);
    this.btn.on('mouseup', () => this.onButtonUp());
};

Button.prototype.onButtonUp = function () {
    this.btn.texture = this.textureUp;
};