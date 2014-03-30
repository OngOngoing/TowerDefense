window.MazeNode = cc.Node.extend({
	layout: [
	'#####################',
	'#                   #',
	'#                   #',
	'#                   #',
	'#                   #',
	'#                   #',
	'X         U         S',
	'#                   #',
	'#                   #',
	'#                   #',
	'#                   #',
	'#                   #',
	'#####################',
	'                    ',
	],

	sprite:  {

		"wall": [s_Wall],
	},

	game: null,
	creepList: [],
	spawnerPosition: null,
	selectorPosition: null,
	tileSize: null,


	init: function(game) {
		this.createLayout();
		this.rebuildMazeState();
		this.creepList = game.creepList;
		this.game = game;
	},

	createLayout: function(){
		var revLayout = this.layout.slice(0);
		revLayout.reverse();
		var size = cc.Sprite.create.apply(null, this.sprite.wall).getBoundingBox();
		this.tileSize = size;
		var self = this;
		revLayout.forEach(function(line, y){
			line.split("").forEach(function(item, x){

				//var ground = cc.Sprite.create.apply(null, self.sprite.ground);
				//ground.setAnchorPoint(0,0);
				//ground.setPosition(x * size.width, y * size.height);
				//self.addChild(ground);

				var spriteName = "wall";
				var blockType = "wall";
				if(item == "_"){
					return;
				}else if(item == "S"){
					self.spawnerPosition = cc.p(x * size.width, y * size.height);
					return;
				}else if(item == "U"){
					spriteName = "ground";
					blockType = "ground";
					self.selectorPosition = cc.p(x * size.width, y * size.height);
				}else if(item == "X"){
					self.basePosition = cc.p(x * size.width, y * size.height);
					return;
				}else if(item == " "){
					spriteName = "ground";
					blockType = "ground";
				}else{
					/*
					// top
					if(revLayout[y+1] && revLayout[y+1][x] == "#"){
						spriteName += "T";
					}
					// bottom
					if(revLayout[y-1] && revLayout[y-1][x] == "#"){
						spriteName += "B";
					}
					// left
					if(revLayout[y][x-1] == "#"){
						spriteName += "L";
					}
					// right
					if(revLayout[y][x+1] == "#"){
						spriteName += "R";
					}
					*/
				}
				var sprite = cc.Sprite.create.apply(null, self.sprite[spriteName]);
				sprite.blockType = blockType;
				sprite.setAnchorPoint(0,0);
				sprite.setPosition(x * size.width, y * size.height);
				self.addChild(sprite);
			});
		});  
	},

	rebuildMazeState: function(){
		var self = this;

		this.mazeState = [];
		for(var i=0; i<this.layout.length; i++){
			var row = [];
			for(var j=0; j<this.layout[i].length; j++){
				row.push(0);
			}
			this.mazeState.push(row);
		}

		var map = {
			"tower": 2,
			"wall": 1,
			"ground":0,
		}

		this.getChildren().forEach(function(item){
			if(item.blockType === undefined){
				return;
			}
			var pos = self.toGridPos(item.getPosition());
			self.mazeState[pos.y][pos.x] = map[item.blockType];
		});

		this.mazeState.forEach(function(l){
			console.log(l.join(""));
		});
		console.log("---------------");
	},

	getBlockAt: function(p){
		var block = this._getBlockAt(p);
		return block ? block.blockType : null;
	},

	createAt: function(p){
		var block = this._getBlockAt(p);
		if(!block || block.blockType != "ground"){
			return false;
		}
		block.blockType = "tower";
		block.tower = Tower.createLow(this.game);
		block.tower.setPosition(p);
		block.tower.setAnchorPoint(0,0);
		block.tower.isShowRange = false;
		this.addChild(block.tower);
		this.rebuildMazeState();
		return true;
	},

	removeAt: function(p){
		var block = this._getBlockAt(p);
		if(!block || block.blockType != "tower" || block.tower == null){
			return false;
		}
		block.blockType = "ground";
		var fadeOut = cc.FadeOut.create(0.2);
            block.tower.tower.runAction(cc.Sequence.create(
                fadeOut,
                cc.CallFunc.create(function () {
                    this.removeChild(block.tower);					
					block.tower.tower = null;
					block.tower = null;
                }, this)
        	));
		this.rebuildMazeState();
		return true;
	},

	_getBlockAt: function(p){
		var self = this;
		var out;
		this.getChildren().some(function(item){
			var pos = item.getPosition();
			if(item.blockType !== undefined && cc.pointEqualToPoint(pos, p)){
				out = item;
				return true;
			}
			return false;
		});
		return out;
	},


	toGridPos: function(p){
		return cc.p(
			Math.floor(p.x/this.tileSize.width),
			Math.floor(this.layout.length - 1 - p.y/this.tileSize.height)
			);
	},


	toGamePos: function(p){
		return cc.p(p.x * this.tileSize.width, (this.layout.length - 1 - p.y)*this.tileSize.height);
	},


});