function WinPanel() {
    PIXI.Container.call(this);
    this.wfd = new PIXI.Sprite(resources.wfd.texture);
    this.addChild(this.wfd);
    this.state = null;
    this.counter = 0;
    this.style = {
        font: "win_font",
    };
    this.text = new PIXI.extras.BitmapText(this.counter, this.style);
    this.text.anchor.set(0.5, 0.5);
    this.text.position.set(this.width / 2, this.height / 2 + 4);
    this.addChild(this.text);
};
WinPanel.prototype = Object.create(PIXI.Container.prototype);
WinPanel.prototype.constructor = WinPanel;

WinPanel.prototype.totalScore = function () {
    this.visible = true;
    if (!this.state && this.counter < score && this.counter >= 0) {
        this.counter += 0.5;
        this.text.text = Math.floor(this.counter).toString();
    } else if (!this.state && this.counter < score + 40 && this.counter >= 0) {
        this.counter += 1
    } else if (!this.state && this.counter === score + 40) {
        this.counter = score;
        this.state = true;
    } else if (this.state && this.counter >= 0) {
        this.counter -= 0.5;
        this.text.text = Math.ceil(this.counter).toString();
    } else if (this.counter < 0) {
        this.state = null;
        score = 0;
        this.visible = false;
        ticker.remove(totalScore);
    };
};