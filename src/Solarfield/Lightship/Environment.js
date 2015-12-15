define(
	'solarfield/lightship-js/src/Solarfield/Lightship/Environment',
	[
		'solarfield/ok-kit-js/src/Solarfield/Ok/ok',
		'solarfield/batten-js/src/Solarfield/Batten/Environment'
	],
	function (Ok, BattenEnvironment) {
		"use strict";

		/**
		 * @class Solarfield.Lightship.Environment
		 * @abstract
		 * @extends Solarfield.Batten.Environment
		 * @constructor
		 */
		var Environment = Ok.extendObject(BattenEnvironment);

		Ok.defineNamespace('Solarfield.Lightship');
		return Environment;
	}
);
