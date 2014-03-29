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

    creepList:[],


    init:function (filename, ball, attackRange, speed, attack,game) {
        this._super();


        this.creepList = game.creepList;
        this._gameLayer = game;

        this.bulletLayer = cc.Layer.create();
        this.bulletLayer.setPosition(cc.p(0, 0));


        // set speed
        this._speed = speed;
        this._attack = attack;
        this._preAttackTime = this.getCurrentTime();

        // set attack range
        this.radius = this._attackRange = attackRange;

        var tower = this._sprite = cc.Sprite.create(filename);
        tower.setAnchorPoint(0, 0);
        this.addChild(tower);

        var size = tower.getTexture().getContentSize();
        this._rect = cc.rect(0, 0, size.width, size.height);

        var ball = this._sBall = cc.Sprite.create(ball);
        ball.setPosition(cc.p(25, 25));
        this.addChild(ball);

        // ball action
        var move = cc.MoveBy.create(1.2, cc.p(0, 6));
        var moveBack = move.reverse();
        ball.runAction(cc.RepeatForever.create(
            cc.Sequence.create(move, moveBack)));


        this.scheduleUpdate();

    },
    getPos:function () {
        return this.getPosition();
    },
    checkAttack:function (monster) {
        if (!monster) {
            // cc.log("monster not null");
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
        var monsterPosition = monster.getPos();
        var tmDistance = cc.pDistance(towerPosition, monsterPosition);

        // if further than attack range
        if (tmDistance > this._attackRange + monster.getAttackedRange()) {
            return;
        }

        // check state
        if (monster.isDie()) {
            return;
        }

        this._preAttackTime = curTime;
        this.attackMonster(monster);
    },
    attackMonster:function (monster) {

            if (this._isLow) {
            	var bullet = cc.Sprite.create(s_Bullet);
            	bullet.setPosition(
            		cc.pAdd(this.getPosition(),
            			this._sBall.getPosition()));

            	this._gameLayer.addChild(bullet);


            	var move = cc.MoveTo.create(0.1, monster.getSpritePos());
            	bullet.runAction(cc.Sequence.create(
            		move,
            		cc.CallFunc.create(function () {
            			bullet.removeFromParent();
            		}, bullet)
            		));
            	monster.lostBlood(this._attack);


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
                this.addChild(this._sAttackRange, -1);
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
        list = this.creepList;
        for (var j = 0, jLen = list.length; j < jLen; j++) {
        	this.checkAttack(list[0]);
        }
    },
});



Tower.create = function (filename, ball, speed, attack,game) {
    var tower = new Tower();
    tower.init(filename, ball, 200, speed, attack,game);
    return tower;
};

Tower.createLow = function (game) {
    var tower = Tower.create(s_Tower[0], s_TowerBall[0], 300, 20,game);
    tower._isLow = true;
    return tower;
};
