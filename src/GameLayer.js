var GameLayer = cc.LayerColor.extend({

    color: new cc.Color4B(0, 0, 0, 255),
    energyCost: 0,


    creepLayer: null,
    creepList: [],
    timer:10,
    timerLabel:null,
    gameState:null,
    level:0,
    maxCreepInLv:[],
    creepNotSpawned:0,
    creepKills:0,
    maxCreepNow:0,


    init: function() {
        this._super(this.color, this.getStageSize().width);
        this.setPosition( new cc.Point( 0, 0 ) );

        this.timer = 10;
        this.gameState = GameLayer.STATE.REST;

        this.maze = new MazeNode();
        this.maze.init(this);
        this.addChild( this.maze );

        this.energyCost = this.maze.energyCost;

        //create Selector
        this.selector = new Selector(this);
        this.selector.setPosition(this.maze.selectorPosition);
        this.addChild(this.selector);

        //create creeps layer
        this.creepLayer = cc.Layer.create();
        this.addChild(this.creepLayer);
        this.creepList = this.creepLayer.getChildren();

        this.createInformationBar();


        this.createKeyboardControl();

        this.initSpawner();

        this.schedule(this.countDownTimer,1);
        this.schedule(this.runSpawner,0.5);

        this.scheduleUpdate();

        return true;
    },

    initSpawner: function() {
        this.maxCreepInLv[0] = 25;
        this.maxCreepInLv[1] = 30;
        this.maxCreepInLv[2] = 35;
        this.maxCreepInLv[3] = 40;

        this.creepNotSpawned = this.maxCreepInLv[0];
        this.maxCreepNow = this.maxCreepInLv[0];
    },

    createEnergyLabel: function() {
        var director = cc.Director.getInstance();
        var winSize = director.getWinSize();
        //var neonColor = cc.c3b(117,248,250);
        var neonDarkColor = cc.c3b(8,103,131);
        var whiteColor = cc.c3b(255,255,255);
        var energyLabel = cc.LabelTTF.create("Energy :", "N-Gage", 28);
        energyLabel.setColor(whiteColor);
        energyLabel.setPosition(120, winSize.height-27);
        
        energyLabel.enableStroke(neonDarkColor,1);
        this.addChild(energyLabel);
    },

    createEnergyCost: function() {
        this.maze.createEnergyCost();
    },

    createTimerLabel: function() {
        var director = cc.Director.getInstance();
        var winSize = director.getWinSize();
        //var neonColor = cc.c3b(117,248,250);
        var whiteColor = cc.c3b(255,255,255);
        this.timerLabel = cc.LabelTTF.create(this.timer, "Imagine", 36);
        this.timerLabel.setColor(whiteColor);
        this.timerLabel.setPosition(winSize.width-30, winSize.height-29.5);

        this.battleInLabel = cc.LabelTTF.create("BATTLE IN", "GoodTimes", 18);
        this.battleInLabel.setColor(whiteColor);
        this.battleInLabel.setPosition(winSize.width-130, winSize.height-29.5);
        var neonColor = cc.c3b(13,109,134);
        
        this.timerLabel.enableStroke(neonColor,1);
        this.battleInLabel.enableStroke(neonColor,1);
        this.addChild(this.timerLabel);
        this.addChild(this.battleInLabel);
    },

    createLevelLabel: function() {
        var director = cc.Director.getInstance();
        var winSize = director.getWinSize();
        //var neonColor = cc.c3b(117,248,250);
        var whiteColor = cc.c3b(255,255,255);
        this.levelNumberLabel = cc.LabelTTF.create(this.level+"", "Imagine", 36);
        this.levelNumberLabel.setColor(whiteColor);
        this.levelNumberLabel.setPosition(winSize.width/2, winSize.height-35);

        this.levelLabel = cc.LabelTTF.create("Level", "N-Gage", 18);
        this.levelLabel.setColor(whiteColor);
        this.levelLabel.setPosition(winSize.width/2, winSize.height-12);
        var neonColor = cc.c3b(13,109,134);
        
        this.levelNumberLabel.enableStroke(neonColor,1);
        this.levelLabel.enableStroke(neonColor,1);
        this.addChild(this.levelNumberLabel);
        this.addChild(this.levelLabel);
    },

    createCreepNumberLabel: function() {
        var director = cc.Director.getInstance();
        var winSize = director.getWinSize();
        var whiteColor = cc.c3b(255,255,255);
        this.creepNumberLabel = cc.LabelTTF.create(this.maze.creepKills, "Imagine", 22);
        this.creepNumberLabel.setColor(whiteColor);
        this.creepNumberLabel.setPosition(winSize.width-50, winSize.height-29.5);

        this.creepKillsLabel = cc.LabelTTF.create("CREEP KILLS", "GoodTimes", 18);
        this.creepKillsLabel.setColor(whiteColor);
        this.creepKillsLabel.setPosition(winSize.width-190, winSize.height-29.5);
        var neonColor = cc.c3b(13,109,134);
        
        this.creepNumberLabel.enableStroke(neonColor,1);
        this.creepKillsLabel.enableStroke(neonColor,1);
        this.addChild(this.creepNumberLabel);
        this.addChild(this.creepKillsLabel);
        this.creepNumberLabel.setOpacity(0);
        this.creepKillsLabel.setOpacity(0);
    },

    updateTimerLabel: function() {
        this.timerLabel.setString(this.timer);
        if(this.timer == 1) {
            cc.AudioEngine.getInstance().setMusicVolume(0.2);
            cc.AudioEngine.getInstance().playMusic(s_Battle1_mp3,true);
        }
    },

    updateCreepKillsLabel: function() {
        this.creepNumberLabel.setString(this.maze.creepKills + "/" + this.maxCreepNow);
    },

    updateLevelLabel: function() {
        this.levelNumberLabel.setString(this.level);

    },

    countDownTimer: function() {
        if(this.gameState == GameLayer.STATE.REST) {
            if(this.timer > 0) {
                this.timer--;
            }
            else {
                this.timerLabel.runAction(cc.FadeOut.create(0.2));
                this.battleInLabel.runAction(cc.FadeOut.create(0.2));
                this.gameState = GameLayer.STATE.BATTLE;
                this.creepNumberLabel.runAction(cc.FadeIn.create(0.2));
                this.creepKillsLabel.runAction(cc.FadeIn.create(0.2));
            }
        }
    },

    createInformationBar: function() {
        this.createEnergyLabel();
        this.createEnergyCost();

        this.createTimerLabel();
        this.createCreepNumberLabel();
        this.createLevelLabel();
    },


    getStageSize: function(){
        return cc.Director.getInstance().getWinSize();
    },

    runSpawner: function() {
        if(this.gameState == GameLayer.STATE.BATTLE) {
            this.autoAddCreep();
        }
    },

    createCreep: function(creepID){

        var creep = creepID;
        creep.setPosition(this.maze.spawnerPosition);
        this.creepLayer.addChild(creep);

    },

    goToNextLevel: function() {
        cc.AudioEngine.getInstance().stopAllEffects();

        cc.AudioEngine.getInstance().stopMusic();

        this.creepNumberLabel.runAction(cc.FadeOut.create(0.2));
        this.creepKillsLabel.runAction(cc.FadeOut.create(0.2));
        this.level++;
        this.timer = 10;
        this.creepNotSpawned = this.maxCreepInLv[this.level];
        this.maxCreepNow += this.maxCreepInLv[this.level];
        this.timerLabel.runAction(cc.FadeIn.create(0.2));
        this.battleInLabel.runAction(cc.FadeIn.create(0.2));

        if(this.level == 4) {
            this.maze.isGameOver = true;
            this.maze.gameOver(true);
        }
    },

    autoAddCreep: function() {
        if(this.creepNotSpawned > 0) {
            this.createCreep(Creep.createLv(this.level, this.maze));
            this.creepNotSpawned--;
        }
        else if(this.creepNotSpawned <= 0 && this.creepList.length <= 0) {
            this.gameState = GameLayer.STATE.REST;
            this.goToNextLevel();
        }
    },

    createKeyboardControl: function(){
        this.kbd = new KeyboardControlLayer(this);
        this.kbd.init();
        this.addChild(this.kbd);
    },

    move: function(dir){
        var map = {
            up: Selector.DIR.UP,
            down: Selector.DIR.DOWN,
            left: Selector.DIR.LEFT,
            right: Selector.DIR.RIGHT,
            createLow: Selector.CTRL.CREATE_LOW,
            createHigh: Selector.CTRL.CREATE_HIGH,
            del: Selector.CTRL.DELETE,
            upgrade: Selector.CTRL.UPGRADE,
            show_range: Selector.CTRL.SHOW_RANGE,

        };
        this.selector.direction = map[dir];
    },

    rebuildCreepPathing: function(){
        for(var i=0; i<this.creepList.length; i++){
            this.creepList[i].findPath();
        }
    },

    update: function() {
        this.maze.updateEnergyLabel();
        this.updateTimerLabel();
        this.updateCreepKillsLabel();
        this.updateLevelLabel();
    },
});


GameLayer.create = function () {
    var sg = new GameLayer();
    if (sg && sg.init(cc.c4b(255, 255, 255, 255))) {
        return sg;
    }
    return null;
};


GameLayer.scene = function () {
    var scene = cc.Scene.create();
    var layer = GameLayer.create();
    scene.addChild(layer);
    return scene;
};

GameLayer.STATE = {
    "REST": 0,
    "BATTLE": 1,
};
