define(
	[
		'solarfield/ok-kit-js/src/Solarfield/Ok/ObjectUtils',
		'solarfield/batten-js/src/Solarfield/Batten/ControllerPlugin'
	],
	function (ObjectUtils, BattenControllerPlugin) {
		"use strict";

		/**
		 * @class Solarfield.Lightship.ControllerPlugin
		 * @extends Solarfield.Batten.ControllerPlugin
		 * @constructor
		 */
		var ControllerPlugin = ObjectUtils.extend(BattenControllerPlugin, {

		});

		return ControllerPlugin;
	}
);
