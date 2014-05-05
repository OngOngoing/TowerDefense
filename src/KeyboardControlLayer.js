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
		this.map[cc.KEY.q] = "createLow";
		this.map[cc.KEY.w] = "createHigh";
		this.map[cc.KEY.e] = "createFreeze";
		this.map[cc.KEY.d] = "del";
		this.map[cc.KEY.u] = "upgrade";
		this.map[cc.KEY.r] = "show_range";
	},

	init: function() {
		this.setKeyboardEnabled(true);
	},

	onKeyDown: function(e){
		if(this.map[e]){
			this.main.move(this.map[e]);
			if(this.map[e] == "createLow" || this.map[e] == "createHigh" || this.map[e] == "createFreeze" || this.map[e] == "del" || this.map[e] == "upgrade") {
				console.log(this.map[e]);
			}
		}
	},
});