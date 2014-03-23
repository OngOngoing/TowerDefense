/* global cc */
/* jshint unused:false */
"use strict";

window.Selector = cc.Sprite.extend({

	ctor: function(game, maze){
		this._super();
		this.initWithFile("res/images/wall.png");
		this.setAnchorPoint(0, 0);

		this.game = game;
		this.maze = maze;

		this.direction = null;
		this.scheduleUpdate();
	},

	update: function(){
		var pos = this.getPosition();
		var targetPos = pos;
		if(this.direction == Selector.DIR.RIGHT){
			targetPos = cc.p(pos.x + this.maze.tileSize.width, pos.y);
			this.direction = null;
		}else if(this.direction == Selector.DIR.LEFT){
			targetPos = cc.p(pos.x - this.maze.tileSize.width, pos.y);
			this.direction = null;
		}else if(this.direction == Selector.DIR.UP){
			targetPos = cc.p(pos.x, pos.y + this.maze.tileSize.height);
			this.direction = null;
		}else if(this.direction == Selector.DIR.DOWN){
			targetPos = cc.p(pos.x, pos.y - this.maze.tileSize.height);
			this.direction = null;
		}
		// wrap around
		var rightSide = this.getStageSize().width - this.maze.tileSize.width;
		var topSide = this.getStageSize().height - this.maze.tileSize.height;
		if(targetPos.x < 0){
			targetPos.x = rightSide;
		}else if(targetPos.x > rightSide){
			targetPos.x = 0;
		}
		if(targetPos.y < 0){
			targetPos.y = topSide;
		}else if(targetPos.y > topSide){
			targetPos.y = 0;
		}
		this.setPosition(targetPos);
		return;
		if(!cc.pointEqualToPoint(pos, targetPos)){
			/*var blockType = this.maze.getBlockAt(targetPos);
			if(blockType == "block"){
				return;
			}else if(blockType == "collect"){
				this.game.collectAt(targetPos);
			}
			*/
			this.setPosition(targetPos);
		}
		
	},

	getStageSize: function(){
		return cc.Director.getInstance().getWinSize();
	}
});

window.Selector.DIR = {
	"DOWN": 0,
	"LEFT": 1,
	"RIGHT": 2,
	"UP": 3,
	"CREATE": 10,
	"DELETE": -1,
	"UPGRADE": 11,
};