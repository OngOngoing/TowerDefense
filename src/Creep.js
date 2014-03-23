var Creep = cc.Sprite.extend({
	timeStep: 0.2,
	ctor: function(maze) {

		this._super();
		this.initWithFile( 'res/images/creep.png' );  


		this.maze = maze;

		this.setAnchorPoint(0, 0);
		


		this.pathFinder = new EasyStar.js();
		this.pathFinder.setAcceptableTiles([0]);
		//this.pathFinder.setTileCost(2, 2);

		this.schedule(this.updateMove, this.timeStep, Infinity, 0);
		this.scheduleUpdate();

		

	},

	updateMove: function(){
		var self = this;

		var maze = this.maze.mazeState.slice(0);

/*
		for(var i=0; i < this.enemyList.length; i++){
			if(this.enemyList[i] == this){
				continue;
			}
			var pos = this.maze.toGridPos(this.enemyList[i].getPosition());
			maze[pos.y][pos.x] = 2;
		}
		*/
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
	},


});