var GameLayer = cc.LayerColor.extend({
    init: function() {
        this._super( new cc.Color4B( 50, 50, 50, 125 ) );
        this.setPosition( new cc.Point( 0, 0 ) );

        this.maze = new MazeNode();
        this.maze.init();
        //this.maze.setPosition( cc.p( 0, 50 ) );
        this.addChild( this.maze );

        this.createCreep();

        return true;
    },

    creepList: [],

    createCreep: function(){
        this.creep = new Creep(this.maze);
        this.creep.setPosition(this.maze.spawnerPosition.pop());
        this.addChild(this.creep);
        this.creepList.push(this.creep);
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

