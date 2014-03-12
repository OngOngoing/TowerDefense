var Creep = cc.Sprite.extend({
    ctor: function() {
        this._super();
        this.initWithFile( 'res/images/creep.png' );  
    }
});