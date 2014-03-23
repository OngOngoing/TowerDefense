/* global cc */
/* jshint unused:false */
"use strict";

window.KeyboardControlLayer = cc.Layer.extend({
	ctor: function(main){
		this._super();
		this.main = main;
		this.buildKeybind();
	},

	buildKeybind: function(){
		this.map = {};
		this.map[cc.KEY.left] = "left";
		this.map[cc.KEY.right] = "right";
		this.map[cc.KEY.up] = "up";
		this.map[cc.KEY.down] = "down";
		this.map[cc.KEY.c] = "create";
		this.map[cc.KEY.d] = "delete";
		this.map[cc.KEY.u] = "upgrade";
	},

	init: function() {
		this.setKeyboardEnabled(true);
	},

	onKeyDown: function(e){
		if(this.map[e]){
			this.main.move(this.map[e]);
			if(this.map[e] == "create" || this.map[e] == "delete" || this.map[e] == "upgrade") {
				console.log(this.map[e]);
			}
		}
	},
});