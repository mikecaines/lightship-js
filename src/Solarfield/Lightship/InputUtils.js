/**
 * {@link http://github.com/solarfield/lightship-js}
 * {@license https://github.com/solarfield/lightship-js/blob/master/LICENSE}
 */

define(
	'solarfield/lightship-js/src/Solarfield/Lightship/InputUtils',
	[
		'solarfield/ok-kit-js/src/Solarfield/Ok/StringUtils',
		'solarfield/ok-kit-js/src/Solarfield/Ok/StructUtils'
	],
	function (StringUtils, StructUtils) {
		"use strict";
		
		let InputUtils = function () {
			throw new Error("Class is abstract.");
		};
		
		/**
		 * Flattens the object, and converts camelCase keys to dash-case.
		 * @param {Object} aObject Structure.
		 * @param {string=} aPrefix A string to prepend to all keys.
		 * @returns {Object}
		 */
		InputUtils.objectToQuery = function (aObject, aPrefix) {
			let query = {};
			let prefix = aPrefix != null ? ''+aPrefix : '';
			
			if (aObject) {
				const object = StructUtils.flatten(aObject);
				
				for (let k in object) {
					let kk = k.split(/\./)
						.map(function (v) {return StringUtils.camelToDash(v).toLowerCase()})
						.join('.');
					
					if (prefix != '') kk = prefix + kk;
					
					query[kk] = object[k];
				}
			}
			
			return query;
		};
		
		return InputUtils;
	}
);