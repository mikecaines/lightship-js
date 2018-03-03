define(
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
		var Environment = ObjectUtils.extend(BattenEnvironment);

		Environment.getBaseChain = function () {
			if (!Environment._sle_baseChain) {
				Environment._sle_baseChain = BattenEnvironment.getBaseChain(this);
				
				
				//adjust some known chain links, to have the lightship-specific path property
				
				StructUtils.find(Environment._sle_baseChain, 'id', 'solarfield/batten-js')
					.path = 'solarfield/batten-js/src/Solarfield/Batten';
				
				StructUtils.find(Environment._sle_baseChain, 'id', 'app')
					.path = 'app/App';
				
				
				//add lightship to the path, immediately after app in priority
				Environment._sle_baseChain.splice(StructUtils.search(Environment._sle_baseChain, 'id', 'app'), 0, {
					id: 'solarfield/lightship-js',
					path: 'solarfield/lightship-js/src/Solarfield/Lightship',
				});
			}
			
			return Environment._sle_baseChain.slice();
		};
		
		ObjectUtils.defineNamespace('Solarfield.Lightship');
		return Environment;
	}
);
