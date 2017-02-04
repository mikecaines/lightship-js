define(
	'solarfield/lightship-js/src/Solarfield/Lightship/Environment',
	[
		'solarfield/ok-kit-js/src/Solarfield/Ok/ObjectUtils',
		'solarfield/ok-kit-js/src/Solarfield/Ok/StructUtils',
		'solarfield/batten-js/src/Solarfield/Batten/Environment'
	],
	function (ObjectUtils, StructUtils, BattenEnvironment) {
		"use strict";

		/**
		 * @class Solarfield.Lightship.Environment
		 * @abstract
		 * @extends Solarfield.Batten.Environment
		 * @constructor
		 */
		const Environment = ObjectUtils.extend(BattenEnvironment);

		Environment.getBaseChain = function () {
			if (!Environment._sle_baseChain) {
				Environment._sle_baseChain = BattenEnvironment.getBaseChain(this);
				
				Environment._sle_baseChain.splice(StructUtils.search(Environment._sle_baseChain, 'id', 'app'), 0, {
					id: 'solarfield/lightship-js',
					namespace: 'Solarfield.Lightship'
				});
			}
			
			return Environment._sle_baseChain.slice();
		};
		
		ObjectUtils.defineNamespace('Solarfield.Lightship');
		return Environment;
	}
);
