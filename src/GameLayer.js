var GameLayer = cc.LayerColor.extend({

    color: new cc.Color4B(0, 0, 0, 255),
    money: 0,


    creepLayer: null,
    creepList: [],


    init: function() {
        this._super(this.color, this.getStageSize().width);
        this.setPosition( new cc.Point( 0, 0 ) );



        this.maze = new MazeNode();
        this.maze.init(this);
        this.addChild( this.maze );

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

        this.schedule(this.autoAddCreep, 2);

        this.scheduleUpdate();

        return true;
    },

    createEnergyLabel: function() {
        var director = cc.Director.getInstance();
        var winSize = director.getWinSize();
        //var neonColor = cc.c3b(117,248,250);
        var neonDarkColor = cc.c3b(8,103,131);
        var whiteColor = cc.c3b(255,255,255);
        var energyLabel = cc.LabelTTF.create("Energy :", "Pirulen", 30);
        energyLabel.setColor(whiteColor);
        energyLabel.setPosition(120, winSize.height-30);
        
        energyLabel.enableStroke(neonDarkColor,1);
        this.addChild(energyLabel);
    },

    createEnergyCost: function() {
        this.maze.createEnergyCost();
    },

    createInformationBar: function() {
        this.createEnergyLabel();
        this.createEnergyCost();
    },


    getStageSize: function(){
        return cc.Director.getInstance().getWinSize();
    },


    createCreep: function(creepID){

        var creep = creepID;
        creep.setPosition(this.maze.spawnerPosition);
        this.creepLayer.addChild(creep);

    },

    autoAddCreep: function() {
        var value = Math.random() * 3;
        if (value > 2)
            this.createCreep(Creep.createLv0(this.maze));
        else if (value > 1)
            this.createCreep(Creep.createLv1(this.maze));
        else
            this.createCreep(Creep.createLv2(this.maze));
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
            create: Selector.CTRL.CREATE,
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

