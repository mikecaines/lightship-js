define(
	[],
	function () {
		"use strict";
		
		/**
		 *
		 * @param {Solarfield.Lightship.Controller} aController
		 * @constructor
		 * @class Solarfield.Lightship.ControllerPlugins
		 */
		var ControllerPlugins = function (aController) {
			this._slcp_controller = aController;
			this._slcp_items = {};
		};
		
		ControllerPlugins.prototype.register = function (aComponentCode) {
			var plugin, component;
			
			if (this._slcp_items[aComponentCode]) throw new Error(
				"Plugin '" + aComponentCode + "' is already registered."
			);
			
			plugin = null;
			
			component = this._slcp_controller.constructor.getComponentResolver().resolveComponent(
				this._slcp_controller.constructor.getChain(this._slcp_controller.getCode()),
				'ControllerPlugin',
				null,
				aComponentCode
			);
			
			if (component) {
				plugin = new component.classObject(this._slcp_controller, aComponentCode);
			}
			
			this._slcp_items[aComponentCode] = {
				plugin: plugin,
				componentCode: aComponentCode
			};
			
			return this.get(aComponentCode);
		};
		
		ControllerPlugins.prototype.get = function (aComponentCode) {
			if (this._slcp_items[aComponentCode] && this._slcp_items[aComponentCode].plugin) {
				return this._slcp_items[aComponentCode].plugin;
			}
			
			return null;
		};
		
		ControllerPlugins.prototype.getByClass = function (aClass) {
			var plugin = null;
			var k;
			
			for (k in this._slcp_items) {
				if (this._slcp_items[k].plugin && this._slcp_items[k].plugin instanceof aClass) {
					if (plugin) throw new Error(
						"Could not retrieve plugin because multiple instances of " + aClass + " are registered."
					);
					
					plugin = this._slcp_items[k].plugin;
				}
			}
			
			return plugin;
		};
		
		return ControllerPlugins;
	}
);
