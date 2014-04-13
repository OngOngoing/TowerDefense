var GameOver = cc.LayerColor.extend({
 
    _won:false,
    neonColor:cc.c3b(117, 248, 250),
 
    ctor:function() {
        this._super();
        cc.associateWithNative( this, cc.LayerColor );
    },
 
    onEnter:function () {
 
        this._super();

        this.createGameOverSprite();
        //this.createGameOverLabel();
        this.runAction(cc.Sequence.create(
            cc.DelayTime.create(12.5),
            cc.CallFunc.create(function(node) {
                var scene = GameLayer.scene();
                var gameTransition = cc.TransitionFade.create(1, scene);
                cc.Director.getInstance().replaceScene(gameTransition);
            }, this)
        ));
 
    },
    createGameOverSprite: function() {
        var director = cc.Director.getInstance();
        var winSize = director.getWinSize();
        var centerPos = cc.p( winSize.width/2, winSize.height/2 );

        this._sprite = cc.Sprite.create(s_gameOver);
        this._sprite.setPosition(centerPos);
        this.addChild(this._sprite);
        this._sprite.setOpacity(0);
        var fadeIn = cc.FadeIn.create(7);
        this._sprite.runAction(fadeIn);
    },
    createGameOverLabel: function() {
        var director = cc.Director.getInstance();
        var winSize = director.getWinSize();
        var centerPos = cc.p( winSize.width/2, winSize.height/2 );

        var message;
        if (this._won) {
            message = "You Won!";
        } else {
            //message = "You Lose :[";
            message = "GAME OVER";
        }
 
        var label = cc.LabelTTF.create(message, "TR2N", 80);
        label.setColor(this.neonColor);
        label.setPosition(winSize.width/2, winSize.height/2);
        this.addChild(label);
        label.setOpacity(0);
        var fadeIn = cc.FadeIn.create(7);
        label.runAction(fadeIn);
    },
});
 
GameOver.create = function (won) {
    var sg = new GameOver();
    sg._won = won;
    if (sg && sg.init(cc.c4b(0, 0, 0, 0))) {
        return sg;
    }
    return null;
};
 
GameOver.scene = function (won) {
    var scene = cc.Scene.create();
    var layer = GameOver.create(won);
    scene.addChild(layer);
    return scene;
};