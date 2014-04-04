/* global cc */
/* jshint unused:false */
"use strict";

window.Selector = cc.Sprite.extend({

	game: null,
	maze: null,
	direction: null,

	ctor: function(game){
		this._super();
		this.initWithFile( s_Selector );
		this.setAnchorPoint(0, 0);

		this.game = game;
		this.maze = game.maze;

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
		

		// REMOVE
		}else if(this.direction == Selector.CTRL.DELETE){
			var blockType = this.maze.getBlockAt(targetPos);
			if(blockType == "wall" || !blockType){
				return;
			}else if(blockType == "tower"){
				this.maze.removeAt(targetPos);
			}
			
			this.direction = null;

		
		//CREATE
		}else if(this.direction == Selector.CTRL.CREATE){
			var blockType = this.maze.getBlockAt(targetPos);
			if(blockType == "tower" || blockType == "wall" || !blockType){
				return;
			}else if(blockType == "ground"){
				console.log("ground");
				this.maze.createAt(targetPos);
			}
			
			this.direction = null;


		//TOGGLE to SHOW TOWER RANGE
		}else if(this.direction == Selector.CTRL.SHOW_RANGE ){
			var block = this.maze._getBlockAt(targetPos);
			if(block == undefined || block.blockType == "wall" || !block.blockType){
				return;
			}else if(block.blockType == "tower"){
				if(block.tower.isShowRange == false) {
					block.tower.isShowRange = true;
					block.tower.showRange(true);
				}
				else {
					block.tower.isShowRange = false;
					block.tower.showRange(false);
				}
			}
			
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
		//this.setPosition(targetPos);

		this.MoveAction = cc.MoveTo.create(0.05, targetPos);
		this.runAction(this.MoveAction);

		return;
		if(!cc.pointEqualToPoint(pos, targetPos)){
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
};

window.Selector.CTRL = {
	"CREATE": 10,
	"DELETE": -1,
	"UPGRADE": 11,
	"SHOW_RANGE": 99,
};