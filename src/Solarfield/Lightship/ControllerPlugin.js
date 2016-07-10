define(
	'solarfield/lightship-js/src/Solarfield/Lightship/ControllerPlugin',
	[
		'solarfield/ok-kit-js/src/Solarfield/Ok/ObjectUtils',
		'solarfield/batten-js/src/Solarfield/Batten/Controller'
	],
	function (ObjectUtils, BattenController) {
		"use strict";

		/**
		 * @class Solarfield.Lightship.ControllerPlugin
		 * @extends Solarfield.Batten.ControllerPlugin
		 * @constructor
		 */
		var ControllerPlugin = ObjectUtils.extend(BattenController, {

		});

		ObjectUtils.defineNamespace('Solarfield.Lightship');
		return Solarfield.Lightship.ControllerPlugin = ControllerPlugin;
	}
);
