function Paytable(array) {
    PIXI.Container.call(this);
    this.paytable = new PIXI.Sprite(resources.paytable.texture);
    this.addChild(this.paytable);
    this.arr = array;
    this.style = {
        fontSize: "48px",
        fontWeight: "bold",
        fill: "white"
    };
    for (var i = 0; i < this.arr.length; i++) {
        var text = new PIXI.Text(this.arr[i], this.style);
        text.anchor.set(0.5, 0.5);
        text.position.set(this.width / 2 + 70, i * 48 + text.height / 2);
        this.addChild(text);
    };
};
Paytable.prototype = Object.create(PIXI.Container.prototype);
Paytable.prototype.constructor = Paytable;