var MazeNode = cc.Node.extend({
	ctor: function() {
		this._super();
		this.WIDTH = 20;
		this.HEIGHT = 13;
		this.setAnchorPoint( cc.p( 0, 0 ) );
		this.MAP = [
		'####################',
		'#                  #',
		'#                  #',
		'#                  #',
		'#                  #',
		'#                  #',
		'                    ',
		'#                  #',
		'#                  #',
		'#                  #',
		'#                  #',
		'#                  #',
		'####################'
		];
		for ( var r = 0; r < this.HEIGHT; r++ ) {
			for ( var c = 0; c < this.WIDTH; c++ ) {
				if ( this.MAP[ r ][ c ] == '#' ) {
					var s = cc.Sprite.create( 'res/images/wall2.png' );
					s.setAnchorPoint( cc.p( 0, 0 ) );
					s.setPosition( cc.p( c * 50, (this.HEIGHT - r - 1) * 50 ) );
					this.addChild( s );
				}
			}
		}
	}
});