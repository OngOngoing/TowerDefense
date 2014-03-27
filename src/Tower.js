var Tower = cc.Sprite.extend({
    ctor: function() {
        this._super();
        this.initWithFile( s_Tower[0] );  
    }
});