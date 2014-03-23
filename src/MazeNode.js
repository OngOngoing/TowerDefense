var MazeNode = cc.Node.extend({
	layout: [
	'####################',
	'#              $   #',
	'#              $ $ #',
	'#              $ $ #',
	'#              $ $ #',
	'#              $ $ #',
	'X         U    $ $CS',
	'#              $ $$#',
	'#              $   #',
	'#            $ $   #',
	'#            $ $   #',
	'#            $     #',
	'####################',
	'                    ',
	],

	sprite:  {

		"wall": ["res/images/wall2.png"],
	},



	towerPosition: null,
	creepPosition: [],
	spawnerPosition: null,
	selectorPosition: null,
	tileSize: null,


	init: function() {
		this.createLayout();
		this.rebuildMazeState();
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
				}else if(item == "$"){
					spriteName = "Tower";
					blockType = "tower";
					var t = new Tower();
					self.towerPosition = cc.p(x * size.width, y * size.height);
					t.setPosition(cc.p(x * size.width, y * size.height));
					t.setAnchorPoint(0,0)
					self.addChild(t);
				}else if(item == "S"){
					self.spawnerPosition = cc.p(x * size.width, y * size.height);
					return;
				}else if(item == "U"){
					self.selectorPosition = cc.p(x * size.width, y * size.height);
					return;
				}else if(item == "X"){
					self.basePosition = cc.p(x * size.width, y * size.height);
					return;
				}else if(item == "C"){
					self.creepPosition.push(cc.p(x * size.width, y * size.height));
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

/*
	ctor: function() {
		this._super();
		this.WIDTH = 20;
		this.HEIGHT = 13;
		this.setAnchorPoint( cc.p( 0, 0 ) );
		this.MAP = this.layout.slice(0) ;
		for ( var r = 0; r < this.HEIGHT; r++ ) {
			for ( var c = 0; c < this.WIDTH; c++ ) {
				if ( this.MAP[ r ][ c ] == '#' ) {
					var s = cc.Sprite.create( 'res/images/wall2.png' );
					s.setAnchorPoint( cc.p( 0, 0 ) );
					s.setPosition( cc.p( c * 50, (this.HEIGHT - r - 1) * 50 ) );
					this.addChild( s );
				}
				else if (this.MAP[ r ][ c ] == '$' ) {
					var t = new Tower();
					t.setAnchorPoint( cc.p( 0, 0 ) );
					t.setPosition( cc.p( c * 50, (this.HEIGHT - r - 1) * 50 ) );
					this.addChild( t );
				}
				else if (this.MAP[ r ][ c ] == 'C' ) {
					var creep = new Creep();
					creep.setAnchorPoint( cc.p( 0, 0 ) );
					creep.setPosition( cc.p( c * 50, (this.HEIGHT - r - 1) * 50 ) );
					this.addChild( creep );
				}
			}
		}
	},
	*/
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
		if(!block || block.blockType != "tower"){
			return false;
		}
		this.addChild(block);
		this.rebuildMazeState();
		return true;
	},

	removeAt: function(p){
		var block = this._getBlockAt(p);
		if(!block || block.blockType != "tower"){
			return false;
		}
		this.removeChild(block);
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