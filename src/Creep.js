var Creep = cc.Sprite.extend({
	_blood:null,
	_maxBlood:null,
	_isDie:false,
	_attackedRange:null,

	_bloodNode:null,
	_sBlood:null,
	_sBloodBackground:null,
	_sAttackedRange:null,
	timeStep: 0.3,
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



		this.pathFinder = new EasyStar.js();
		this.pathFinder.setAcceptableTiles([0]);
		//this.pathFinder.setTileCost(2, 2);

		this.schedule(this.updateMove, this.timeStep, Infinity, 0);
		this.scheduleUpdate();
    },

    updateMove: function(){
    	var self = this;

    	var maze = this.maze.mazeState.slice(0);

		this.pathFinder.setGrid(maze);

		var basePos = this.maze.toGridPos(this.maze.basePosition);
		var pos = this.maze.toGridPos(this.getPosition());

		this.pathFinder.findPath(
			pos.x, pos.y, basePos.x, basePos.y,
			function(path){
				if(path === null){
					console.log("STUCKED")
					return;
				}else if(path.length < 2){
					console.log("Destination Reached!")
					return;
				}else{
					self.setPosition(self.maze.toGamePos(cc.p(path[1].x, path[1].y)));
				}
			}
			);
	},


	update: function(){
		this.pathFinder.calculate();
		//this._bloodNode.setPosition(this._sprite.getPosition());
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
            // die
            this._blood = 0;
            var fadeOut = cc.FadeOut.create(0.5);
            this._sBlood.runAction(fadeOut.clone());
            this._sBloodBackground.runAction(fadeOut.clone());
            this._sprite.runAction(cc.Sequence.create(
                fadeOut,
                cc.CallFunc.create(function () {
                    this.removeFromParent();
                }, this)
            ));
            this._isDie = true;
            //HD.SCORE += this._maxBlood;

            //if (HD.SOUND) {
                cc.AudioEngine.getInstance().playEffect(s_MonsterDie_mp3);
            //}
        }
        this._sBlood.setScaleX(this._blood / this._maxBlood);
    },
    isDie:function () {
        return this._isDie;
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


Creep.create = function (maze, filename, maxBlood) {
    var creep = new Creep(maze);
    creep.init(filename);
    creep.setBlood(maxBlood);
    return creep;
};

Creep.createLv1 = function (maze) {
    return Creep.create(maze,s_Creep[0], 200);
};