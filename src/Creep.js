var Creep = cc.Sprite.extend({
	_blood:null,
	_maxBlood:null,
	_isDie:false,
	_attackedRange:null,

	_bloodNode:null,
	_sBlood:null,
	_sBloodBackground:null,
	_sAttackedRange:null,
    _isFlying:false,
    _isSlowed:false,
    _cost:0,
    stack:0,
    prestack:0,
    maze:null,

	timeStep: 0.4,
    originalTimeStep: 0.4,
	ctor: function(maze) {

		this._super();
		//this.initWithFile( s_Creep[0] );  


		this.maze = maze;

		this.setAnchorPoint(0, 0);	

	},

	init:function (filename) {
		this._super();

        // set attacked range
        this.radius = this._attackedRange = 15;

        // init blood
        this._bloodNode = cc.Node.create();

        this._sprite = cc.Sprite.create(filename);
        this._sprite.setAnchorPoint(0, 0);
        this.addChild(this._sprite);

        // blood
        var blood = cc.Sprite.create(s_Blood);
        var contentSize = blood.getContentSize();
        blood.setAnchorPoint(cc.p(0, 0.5));
        //blood.setAnchorPoint(cc.p(-1.05, -4.5));
        this._bloodNode.addChild(blood);
        var bloodBackground = cc.Sprite.create(s_BloodBackground);
        this._bloodNode.addChild(bloodBackground);

        this._bloodNode.setAnchorPoint(0,0);

        bloodBackground.setAnchorPoint(cc.p(-0.42, -3));
        bloodBackground.setPosition(cc.p(0, 20));

        //blood.setPosition(cc.p(-contentSize.width / 2, 20));
        blood.setPosition(cc.p((-contentSize.width / 2)+25, 45));
        this.addChild(this._bloodNode);
        this._sBlood = blood;


        this._sBloodBackground = bloodBackground;



		this.pathFinder = new PF.AStarFinder();
		//this.pathFinder.setTileCost(2, 2);

        this.scheduleUpdate();
    },

    updateMove: function(){
    	if(!this.path){
            this.findPath();
        }

        var path = this.path.shift();
        var distance = cc.pDistance(this.getPosition(), this.maze.basePosition);
        if(!path && !this._isFlying){
            if( distance <=10 ) {
                console.log("Destination Reached!");
                this.maze.isGameOver = true;
                this.maze.gameOver(false);
            }
            else {
                console.log("Destination not found!");
                if(this.stack == 0 ) {
                    this.prestack = (new Date()).valueOf() ;
                }
                this.stack = ((new Date()).valueOf() - this.prestack ) /1000;

                if(this.stack >= 3) {
                    this.maze.isGameOver = true;
                    this.maze.gameOver(false);
                }
            }
            return;
        }
        if(this._isFlying) {
            this.flyToBasePosition();            
        }
        else {
            var movePath = this.maze.toGamePos(cc.p(path[0], path[1]));
            this.moveAction = cc.MoveTo.create(this.timeStep, movePath);
            
            this.stopAllActions();
            this.runAction(this.moveAction);
        }

	},

    findPath: function(){
        var maze = this.maze.mazeState.slice(0);
        var grid = new PF.Grid(maze[0].length,maze.length, maze);

        var basePos = this.maze.toGridPos(this.maze.basePosition);
        var pos = this.maze.toGridPos(this.getPosition());

        this.path = this.pathFinder.findPath(Math.max(0, pos.x), pos.y,basePos.x,basePos.y,grid);
        this.path.shift();

        return this.path;
    },

    flyToBasePosition: function() {
        var movePath = this.maze.basePosition;
        this.moveAction = cc.MoveTo.create(this.timeStep, movePath);
        this.runAction(cc.Sequence.create(
            this.moveAction,
            cc.CallFunc.create(function () {
                if(!this.maze.isGameOver) {
                    this.maze.isGameOver = true;
                    this.maze.gameOver(false);
                }
            }, this)
        ));
    },
    Freeze: function(duration,slowValue) {
        this._slowDuration = duration;
        if(!this._isSlowed) {
            this.schedule(this.countDownFreezeTime,1);
            this._isSlowed = true;
            this.timeStep += slowValue;
            this._sprite.setColor(cc.c3b(102, 255, 255));
        }
        

    },

    countDownFreezeTime: function() {
        this._slowDuration--;
    },



	update: function(){
		if(!this.moveAction || this.moveAction.isDone()){
            this.updateMove();
        }
        if(this._slowDuration <= 0) {
            this._isSlowed = false;
            this.unschedule(this.countDownFreezeTime);
            this.timeStep = this.originalTimeStep;
            this._sprite.setColor(cc.c3b(255, 255, 255));
        }
	},


	getSprite:function () {
        return this._sprite;
    },
    getPos:function () {
        //return this._sprite.getPosition();
        return this.getPosition();
    },

    getSpritePos: function () {
        return cc.p(this.getPosition().x+25,this.getPosition().y+25);
    },

    setBlood:function (maxBlood) {
        this._blood = maxBlood;
        this._maxBlood = maxBlood;
    },
    lostBlood:function (blood) {
        this._blood = this._blood - blood;
        if (this._blood <= 0) {
            this.die();
        }
        this._sBlood.setScaleX(this._blood / this._maxBlood);
    },
    die: function() {
        this._blood = 0;
        var fadeOut = cc.FadeOut.create(0.2);
        this._sBlood.runAction(fadeOut.clone());
        this._sBloodBackground.runAction(fadeOut.clone());
        this._sprite.runAction(cc.Sequence.create(
            fadeOut,
            cc.CallFunc.create(function () {
                this.removeFromParent();
            }, this)
        ));
        this._isDie = true;
        this.maze.creepKills++;
        this.maze.energyCost += this._cost;
        
        //cc.AudioEngine.getInstance().playEffect(s_MonsterDie_mp3);
    },
    isDie:function () {
        return this._isDie;
    },
    setCost:function(value) {
        this._cost = value;
    },
    setIsFlying: function(value) {
        this._isFlying = value;
    },
    setSpeed: function(value) {
        this.timeStep = value;
        this.originalTimeStep = value;
    },

    destinationBlockedStack: function() {
        this.stack += 1;
    },

    getAttackedRange:function () {
        return this._attackedRange;
    },
    showRange:function (value) {
        if (value) {
            if (!this._sAttackedRange) {
                this._sAttackedRange = cc.Sprite.create(s_AttackRange);
                this._bloodNode.addChild(this._sAttackedRange);
            }

            var sarRadii = this._sAttackedRange.getContentSize().width / 2;
            var scale = this._attackedRange / sarRadii;
            this._sAttackedRange.setScale(scale);

        } else {
            if (this._sAttackedRange)
                this._sAttackedRange.removeFromParent();
            this._sAttackedRange = null;
        }
    }


});


Creep.create = function (maze, filename, maxBlood, cost) {
    var creep = new Creep(maze);
    creep.init(filename);
    creep.setBlood(maxBlood);
    creep.setCost(cost);
    return creep;
};

Creep.createHaste = function(maze, filename, maxBlood, cost, speed) {
    var creep = new Creep(maze);
    creep.init(filename);
    creep.setBlood(maxBlood);
    creep.setCost(cost);
    creep.setSpeed(speed);
    return creep;
};

Creep.createFlying = function(maze, filename, maxBlood, cost, speed) {
    var creep = new Creep(maze);
    creep.init(filename);
    creep.setBlood(maxBlood);
    creep.setCost(cost);
    creep.setSpeed(speed);
    creep.setIsFlying(true);
    return creep;
};

Creep.createLv = function( lv, maze ) {
    if(lv == 0) return Creep.create(maze,s_Creep[0], 150,1);
    else if(lv == 1) return Creep.create(maze,s_Creep[1], 400,2);
    else if(lv == 2) return Creep.create(maze,s_Creep[2], 600,2);
    else if(lv == 3) return Creep.create(maze,s_Creep[3], 1000,3);
    else if(lv == 4) return Creep.create(maze,s_Creep[4], 2000,3);
    else if(lv == 5) return Creep.createHaste(maze,s_Creep[5], 2500,4,0.1);
    else if(lv == 6) return Creep.create(maze,s_Creep[6], 5000,4);
    else if(lv == 7) return Creep.create(maze,s_Creep[7], 6000,5);
    else if(lv == 8) return Creep.create(maze,s_Creep[8], 8000,5);
    else if(lv == 9) return Creep.create(maze,s_Creep[9], 10000,6);
    else if(lv == 10) return Creep.createFlying(maze,s_Creep[10], 4000,7,10);
    else if(lv == 11) return Creep.createFlying(maze,s_Creep[11], 7000,7,5);
};