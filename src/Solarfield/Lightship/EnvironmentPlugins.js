define(
	[],
	function () {
		"use strict";
		
		/**
		 *
		 * @param {Solarfield.Lightship.Environment} aEnvironment
		 * @constructor
		 * @class Solarfield.Lightship.EnvironmentPlugins
		 */
		var EnvironmentPlugins = function (aEnvironment) {
			this._slep_environment = aEnvironment;
			this._slep_items = {};
		};
		
		EnvironmentPlugins.prototype.register = function (aComponentCode) {
			var plugin, component;
			
			if (this._slep_items[aComponentCode]) throw new Error(
				"Plugin '" + aComponentCode + "' is already registered."
			);
			
			plugin = null;
			
			component = this._slep_environment.getComponentResolver().resolveComponent(
				this._slep_environment.getComponentChain(),
				'EnvironmentPlugin',
				null,
				aComponentCode
			);
			
			if (component) {
				plugin = new component.classObject(this._slep_environment, aComponentCode);
			}
			
			this._slep_items[aComponentCode] = {
				plugin: plugin,
				componentCode: aComponentCode
			};
			
			return this.get(aComponentCode);
		};
		
		EnvironmentPlugins.prototype.get = function (aComponentCode) {
			if (this._slep_items[aComponentCode] && this._slep_items[aComponentCode].plugin) {
				return this._slep_items[aComponentCode].plugin;
			}
			
			return null;
		};
		
		EnvironmentPlugins.prototype.getByClass = function (aClass) {
			var plugin = null;
			var k;
			
			for (k in this._slep_items) {
				if (this._slep_items[k].plugin && this._slep_items[k].plugin instanceof aClass) {
					if (plugin) throw new Error(
						"Could not retrieve plugin because multiple instances of " + aClass + " are registered."
					);
					
					plugin = this._slep_items[k].plugin;
				}
			}

			return plugin;
		};
		
		EnvironmentPlugins.prototype.expectByClass = function (aClass) {
			var plugin = this.getByClass(aClass);
			
			if (!plugin) throw new Error(
				"Expected plugin of type '" + aClass + "'."
			);
			
			return plugin;
		};
		
		return EnvironmentPlugins;
	}
);
