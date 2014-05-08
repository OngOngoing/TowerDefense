var InformationLayer = cc.LayerColor.extend({

    color: new cc.Color4B(0, 0, 0, 255),
    game: null,
    _skills: [],



    init: function(game) {
        this._super(this.color, 230, this.getStageSize().height);
        this.game = game;
        this.createSkillsInformation();
        //this.createControllerInformation();

        return true;
    },

    createSkillsInformation: function() {
        var director = cc.Director.getInstance();
        var winSize = director.getWinSize();

        for(var i=0 ; i< 5; i++) {
            this._skills[i] = cc.Sprite.create(s_TWSkills[i]);
            this._skills[i].setAnchorPoint(0, 0);
            this._skills[i].setPosition(0,winSize.height-150-(i*100));
            this.addChild(this._skills[i]);
        }
    },

    createControllerInformation: function() {
        var director = cc.Director.getInstance();
        var winSize = director.getWinSize();

        var neonDarkColor = cc.c3b(8,103,131);
        var whiteColor = cc.c3b(255,255,255);
        var energyLabel = cc.LabelTTF.create("Q \n create low tower", "N-Gage", 20);
        energyLabel.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        energyLabel.setColor(whiteColor);
        energyLabel.setPosition(100, winSize.height-100);
        
        energyLabel.enableStroke(neonDarkColor,1);
        this.addChild(energyLabel);
    },
    pushSkill: function(index) {
        var fadeIn = cc.FadeIn.create(0.1);
        var fadeOut = cc.FadeOut.create(0.1);
        var delay = cc.DelayTime.create(0.1);
        this._skills[index].runAction(cc.Sequence.create(fadeOut, delay, fadeIn));

    },

    getStageSize: function(){
        return cc.Director.getInstance().getWinSize();
    },

});