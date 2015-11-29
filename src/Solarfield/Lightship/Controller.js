"use strict";

/**
 * @namespace Solarfield.Lightship
 */
Solarfield.Ok.defineNamespace('Solarfield.Lightship');

/**
 * @class Solarfield.Lightship.Controller
 * @extends Solarfield.Batten.Controller
 * @constructor
 */
Solarfield.Lightship.Controller = Solarfield.Ok.extendObject(Solarfield.Batten.Controller, {
	constructor: function (aCode, aOptions) {
		Solarfield.Batten.Controller.call(this, aCode, aOptions);

		this._lc_queuedPlugins = Solarfield.Ok.objectGet(aOptions, 'pluginRegistrations');
	},

	resolvePlugins: function () {
		Solarfield.Batten.Controller.prototype.resolvePlugins.call(this);

		var i, plugins;

		if (this._lc_queuedPlugins) {
			plugins = this.getPlugins();

			for (i = 0; i < this._lc_queuedPlugins.length; i++) {
				plugins.register(this._lc_queuedPlugins[i].componentCode, this._lc_queuedPlugins[i].installationCode);
			}
		}
	},

	hookup: function () {
		Solarfield.Batten.Controller.prototype.hookup.call(this);

		var pendingData, messages, i, el;

		//remove the bootstrap script from the dom
		el = document.getElementById('appBootstrapScript');
		if (el) {
			el.parentNode.removeChild(el);
		}

		if (self.console) {
			pendingData = new Solarfield.Ok.HashMap(this.getModel().get('app.pendingData'));
			messages = pendingData.getAsArray('app.standardOutput.messages');

			for (i = 0; i < messages.length; i++) {
				console.log(messages[i].message);
			}
		}
	}
});
