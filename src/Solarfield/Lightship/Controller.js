define(
	'solarfield/lightship-js/src/Solarfield/Lightship/Controller',
	[
		'solarfield/batten-js/src/Solarfield/Batten/Controller',
		'solarfield/ok-kit-js/src/Solarfield/Ok/ok'
	],
	function (BattenController, Ok) {
		"use strict";

		/**
		 * @class Solarfield.Lightship.Controller
		 * @extends Solarfield.Batten.Controller
		 * @constructor
		 */
		var Controller = Ok.extendObject(BattenController, {
			constructor: function (aCode, aOptions) {
				Controller.super.call(this, aCode, aOptions);

				this._lc_queuedPlugins = Ok.objectGet(aOptions, 'pluginRegistrations');
			},

			resolvePlugins: function () {
				Controller.super.prototype.resolvePlugins.call(this);

				var i, plugins;

				if (this._lc_queuedPlugins) {
					plugins = this.getPlugins();

					for (i = 0; i < this._lc_queuedPlugins.length; i++) {
						plugins.register(this._lc_queuedPlugins[i].componentCode, this._lc_queuedPlugins[i].installationCode);
					}
				}
			},

			hookup: function () {
				Controller.super.prototype.hookup.call(this);

				var pendingData, messages, i;

				if (self.console) {
					pendingData = new Ok.HashMap(this.getModel().get('app.pendingData'));
					messages = pendingData.getAsArray('app.standardOutput.messages');

					for (i = 0; i < messages.length; i++) {
						console.log(messages[i].message);
					}
				}
			}
		});

		Ok.defineNamespace('Solarfield.Lightship');
		return Solarfield.Lightship.Controller = Controller;
	}
);
