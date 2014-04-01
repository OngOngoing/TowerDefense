var Tower = cc.Layer.extend({
    _gameLayer:null,
    _isLow:false,

    _speed:null,
    _attack:null,
    _preAttackTime:null,
    _attackRange:null,

    _sAttackRange:null,
    _sBall:null,

    _sprite:null,
    _rect:null,

    bulletLayer:null,
    bullet:null,

    creepLayer: null,
    creepList:[],

    tower:null,
    cache: null,

    isConstructed:null,

    spriteID:[],


    init:function (spriteID, ball, attackRange, speed, attack,game) {
        this._super();

        this.creepLayer = game.creepLayer;
        this.creepList = game.creepLayer.getChildren();
        this._gameLayer = game;

        this.isConstructed = false;
        this.spriteID = spriteID;


        this.bulletLayer = cc.Layer.create();
        this.bulletLayer.setPosition(cc.p(0, 0));


        // set speed
        this._speed = speed;
        this._attack = attack;
        this._preAttackTime = this.getCurrentTime();

        // set attack range
        this.radius = this._attackRange = attackRange;

        // Construct a tower // Creating sprite using spriteFrame
        this.createAnimatedSprite();

        
        var ball = this._sBall = cc.Sprite.create(ball);
        ball.setPosition(cc.p(25, 25));
        ball.setOpacity(0);
        this.addChild(ball);

        this._sBall.runAction(cc.FadeIn.create(1.8));



        /*
        // ball action
        
        var move = cc.MoveBy.create(1.2, cc.p(0, 6));
        var moveBack = move.reverse();
        ball.runAction(cc.RepeatForever.create(
            cc.Sequence.create(move, moveBack)));
        */
        this.scheduleUpdate();

    },

    createAnimatedSprite: function() {

        this.tower = this._sprite = cc.Sprite.createWithSpriteFrameName(this.spriteID[0] + "1.png");

        this.tower.setAnchorPoint(0, 0);
        this.addChild(this.tower);

        var size = this.tower.getTexture().getContentSize();
        this._rect = cc.rect(0, 0, size.width, size.height);
        
        // init Constructing Action
        var animFrames = [];
        for (var i = 1; i <= this.spriteID[1]; i++) {
            var str = this.spriteID[0] + i + ".png";
            var cache = cc.SpriteFrameCache.getInstance();
            var frame = cache.getSpriteFrame(str);
            animFrames.push(frame);
        }

        var animation = cc.Animation.create(animFrames, this.spriteID[3]);
        this.tower.constructingAction = cc.Animate.create(animation);
        this.tower.runAction(this.tower.constructingAction);





    },

    createActiveAnimation: function() {

        // Tower's standing animation
        animFrames = [];
        for (var i = this.spriteID[1] +1; i <= this.spriteID[2]; i++) {
                var str = this.spriteID[0] + i + ".png";

                var cache = cc.SpriteFrameCache.getInstance();
                var frame = cache.getSpriteFrame(str);
                animFrames.push(frame);
        }

        var animation = cc.Animation.create(animFrames, this.spriteID[4]);
        this.tower.runningStandingAction = cc.RepeatForever.create(cc.Animate.create(animation));
        this.tower.runAction(this.tower.runningStandingAction);
/*
        this.tower.runningStandingAction = cc.Animate.create(animation);
        var isFinish = function() {
            //this.tower.stopAllActions();
            if ( this.isConstructed == false ) {
                return;
            }
        };
        var finish = cc.CallFunc.create(isFinish, this.tower);
        var seq = cc.Sequence.create(this.tower.runningStandingAction, finish);
        this.tower.runAction(seq);
        
*/
    },

    getPos:function () {
        return this.getPosition();
    },
    checkAttack:function (creep) {
        if (!creep) {
            // cc.log("creep not null");
            return;
        }

        // check attack speed
        var curTime = this.getCurrentTime();
        if (curTime - this._preAttackTime < this._speed) {
            // cc.log("check attack speed ");
            return;
        }

        // check attack range
        var towerPosition = this.getPosition();
        var creepPosition = creep.getPos();
        var tmDistance = cc.pDistance(towerPosition, creepPosition);

        // if further than attack range
        if (tmDistance > this._attackRange + creep.getAttackedRange()) {
            return;
        }

        // check state
        if (creep.isDie()) {
            return;
        }

        this._preAttackTime = curTime;
        this.attackCreep(creep);
    },
    attackCreep:function (creep) {

            if (this._isLow) {
            	var bullet = cc.Sprite.create(s_Bullet);
            	bullet.setPosition(
            		cc.pAdd(this.getPosition(),
            			this._sBall.getPosition()));

            	this._gameLayer.addChild(bullet);


            	var move = cc.MoveTo.create(0.1, creep.getSpritePos());
            	bullet.runAction(cc.Sequence.create(
            		move,
            		cc.CallFunc.create(function () {
            			bullet.removeFromParent();
            		}, bullet)
            	));
            	creep.lostBlood(this._attack);


            	//sound
               	cc.AudioEngine.getInstance().playEffect(s_AttackEffect_mp3);
            }
    },
    setGameLayer:function (gameLayer) {
        this._gameLayer = gameLayer;
    },
    getCurrentTime:function () {
        return (new Date()).valueOf();
    },
    showRange:function (value) {

        if (value) {
            if (!this._sAttackRange) {
                this._sAttackRange = cc.Sprite.create(s_AttackRange);
                this._sAttackRange.setPosition(25,25);
                this._sAttackRange.setOpacity(0);
                this.addChild(this._sAttackRange, +100);
            }

            var fadeIn = cc.FadeIn.create(0.2);

            var sarRadii = this._sAttackRange.getContentSize().width / 2;
            var scale = this._attackRange / sarRadii;
            this._sAttackRange.setScale(scale);
            this._sAttackRange.runAction(fadeIn);

        } else {
            if (this._sAttackRange) {

            	var fadeOut = cc.FadeOut.create(0.2);
           		this._sAttackRange.runAction(cc.Sequence.create(
                	fadeOut,
                	cc.CallFunc.create(function () {
                		//after faded out
                    	this._sAttackRange.removeFromParent();
                		this._sAttackRange = null;
                	}, this)
            	));
            }
        }
    },

    update:function (dt) {
        this._sBall.setRotation(this._sBall.getRotation()+10);

        if ( this.tower.constructingAction.isDone() && this.isConstructed == false ) {
            this.isConstructed = true;
            this.createActiveAnimation();
        }
        else if( this.isConstructed ) {
            list = this.creepList;
            for (var j = 0, jLen = list.length; j < jLen; j++) {
        	   this.checkAttack(list[j]);
            }
        }
    },
});



Tower.create = function (spriteValue, ball, speed, attack,game) {
    var tower = new Tower();
    tower.init(spriteValue, ball, 200, speed, attack,game);
    return tower;
};

Tower.createLow = function (game) {
    var cache = cc.SpriteFrameCache.getInstance();
    cache.addSpriteFrames( s_Disk[0], s_Disk[1] );
    var spriteValue = [];
    
    // NAME TAG SPRITE
    spriteValue.push("disk");

    // Constructing SPRITE END
    spriteValue.push(21);

    // Active SPRITE END
    spriteValue.push(34);

    // Constructing time
    spriteValue.push(0.05);

    // Active animation time rate
    spriteValue.push(0.08);

    var tower = Tower.create(spriteValue, s_TowerBall[0], 300, 20,game);
    tower._isLow = true;
    return tower;
};

Tower.createFreeze = function (game) {
    var cache = cc.SpriteFrameCache.getInstance();
    cache.addSpriteFrames( s_Android[0], s_Android[1] );
    var spriteValue = [];
    // NAME TAG SPRITE
    spriteValue.push("android");

    // Constructing SPRITE END
    spriteValue.push(10);

    // Active SPRITE END
    spriteValue.push(83);

    // Constructing time
    spriteValue.push(0.04);

    // Active animation time rate
    spriteValue.push(0.025);
    var tower = Tower.create(spriteValue, s_TowerBall[0], 300, 20,game);
    tower._isLow = true;
    return tower;
};
