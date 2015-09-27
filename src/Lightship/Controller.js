"use strict";

/**
 * @namespace Lightship
 */
if (!self.Lightship) self.Lightship = {};




/**
 * @class Lightship.Controller
 * @extends Batten.Controller
 * @constructor
 */
Lightship.Controller = Ok.extendObject(Batten.Controller, function (aCode, aOptions) {
	Batten.Controller.call(this, aCode, aOptions);

	this._lc_queuedPlugins = Ok.objectGet(aOptions, 'pluginRegistrations');
});

Lightship.Controller.prototype.resolvePlugins = function () {
	Batten.Controller.prototype.resolvePlugins.call(this);

	var i, plugins;

	if (this._lc_queuedPlugins) {
		plugins = this.getPlugins();

		for (i = 0; i < this._lc_queuedPlugins.length; i++) {
			plugins.register(this._lc_queuedPlugins[i].componentCode, this._lc_queuedPlugins[i].installationCode);
		}
	}
};

Lightship.Controller.prototype.hookup = function () {
	Batten.Controller.prototype.hookup.call(this);

	var pendingData, messages, i, el;

	//remove the bootstrap script from the dom
	el = document.getElementById('appBootstrapScript');
	if (el) {
		el.parentNode.removeChild(el);
	}

	if (self.console) {
		pendingData = new Ok.HashMap(this.getModel().get('app.pendingData'));
		messages = pendingData.getAsArray('app.standardOutput.messages');

		for (i = 0; i < messages.length; i++) {
			console.log(messages[i].message);
		}
	}
};
