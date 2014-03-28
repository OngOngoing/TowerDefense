var GameLayer = cc.LayerColor.extend({

    color: new cc.Color4B(0, 0, 0, 255),
    money: 0,

    init: function() {
        this._super(this.color, this.getStageSize().width);
        //this._super( new cc.Color4B( 50, 50, 50, 125 ) );
        //this._super( new cc.Color4B( 30, 30, 30, 100 ) );
        this.setPosition( new cc.Point( 0, 0 ) );



        this.maze = new MazeNode();
        this.maze.init(this);
        //this.maze.setPosition( cc.p( 0, 50 ) );
        this.addChild( this.maze );


        this.selector = new Selector(this, this.maze);
        this.selector.setPosition(this.maze.selectorPosition);
        this.addChild(this.selector);


        this.createCreep();

        this.createKeyboardControl();

        return true;
    },


    getStageSize: function(){
        return cc.Director.getInstance().getWinSize();
    },


    creepList: [],

    createCreep: function(){
        var creep = Creep.createLv1(this.maze);
        creep.setPosition(this.maze.spawnerPosition);
        
        this.addChild(creep);

        this.creepList.push(creep);

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

        };
        this.selector.direction = map[dir];
    },
});

var StartScene = cc.Scene.extend({
    onEnter: function() {
        this._super();
        var layer = new GameLayer();
        layer.init();
        this.addChild( layer );
    }
});

