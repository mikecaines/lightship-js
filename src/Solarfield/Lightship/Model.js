define(
	[
		'solarfield/ok-kit-js/src/Solarfield/Ok/ObjectUtils',
		'solarfield/ok-kit-js/src/Solarfield/Ok/StructProxy',
	],
	function (ObjectUtils, StructProxy) {
		"use strict";
		
		/**
		 * @class Solarfield.Lightship.Model
		 * @extends Solarfield.Ok.StructProxy
		 */
		var Model = ObjectUtils.extend(StructProxy);
		
		return Model;
	}
);