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

	checkWrapAround: function(targetPos) {
		var pos = this.getPosition();
		var targetPos = targetPos;

		//var rightSide = this.getStageSize().width - this.maze.tileSize.width;
		var rightSide = 1000;
		var topSide = this.getStageSize().height - 2*this.maze.tileSize.height;
		if(targetPos.x < 0){
			targetPos.x = 0;
			this.setPosition(targetPos);
		}else if(targetPos.x > rightSide){
			targetPos.x = rightSide;
			this.setPosition(targetPos);
		}
		if(targetPos.y < 0 + this.maze.tileSize.height){
			targetPos.y = this.maze.tileSize.height;
			this.setPosition(targetPos);
		}else if(targetPos.y > topSide){
			targetPos.y = topSide;
			this.setPosition(targetPos);
		}
	},

	update: function(){
		var pos = this.getPosition();
		var targetPos = pos;

		this.checkWrapAround(targetPos);

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
			this.game.informationLayer.pushSkill(4);
			var blockType = this.maze.getBlockAt(targetPos);
			if(blockType == "wall" || !blockType){
				return;
			}else if(blockType == "tower"){
				this.maze.removeAt(targetPos);

			}
			
			this.direction = null;

		
		//CREATE LOW
		}else if(this.direction == Selector.CTRL.CREATE_LOW){
			this.game.informationLayer.pushSkill(0);
			var blockType = this.maze.getBlockAt(targetPos);
			if(blockType == "tower" || blockType == "wall" || !blockType){
				return;
			}else if(blockType == "ground"){
				console.log("ground");
				this.maze.createAt(targetPos,"LOW");
				
			}
			
			this.direction = null;	
		}


		//CREATE HIGH
		else if(this.direction == Selector.CTRL.CREATE_HIGH){
			this.game.informationLayer.pushSkill(1);
			var blockType = this.maze.getBlockAt(targetPos);
			if(blockType == "tower" || blockType == "wall" || !blockType){
				return;
			}else if(blockType == "ground"){
				console.log("ground");
				this.maze.createAt(targetPos,"HIGH");
				
			}
			
			this.direction = null;

		}

		//CREATE FREEZE
		else if(this.direction == Selector.CTRL.CREATE_FREEZE){
			this.game.informationLayer.pushSkill(2);
			var blockType = this.maze.getBlockAt(targetPos);
			if(blockType == "tower" || blockType == "wall" || !blockType){
				return;
			}else if(blockType == "ground"){
				console.log("ground");
				this.maze.createAt(targetPos,"FREEZE");
				
			}
			
			this.direction = null;

		}


		//TOGGLE to SHOW TOWER RANGE
		else if(this.direction == Selector.CTRL.SHOW_RANGE ){
			this.game.informationLayer.pushSkill(3);
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
		this.checkWrapAround(targetPos);
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
	"CREATE_LOW": 10,
	"CREATE_HIGH":11,
	"CREATE_FREEZE":12,
	"DELETE": -1,
	"UPGRADE": 50,
	"SHOW_RANGE": 99,
};