define(
	'solarfield/lightship-js/src/Solarfield/Lightship/Environment',
	[
		'solarfield/ok-kit-js/src/Solarfield/Ok/ObjectUtils',
		'solarfield/batten-js/src/Solarfield/Batten/Environment'
	],
	function (ObjectUtils, BattenEnvironment) {
		"use strict";

		/**
		 * @class Solarfield.Lightship.Environment
		 * @abstract
		 * @extends Solarfield.Batten.Environment
		 * @constructor
		 */
		var Environment = ObjectUtils.extend(BattenEnvironment);

		ObjectUtils.defineNamespace('Solarfield.Lightship');
		return Environment;
	}
);
