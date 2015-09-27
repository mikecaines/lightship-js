"use strict";

/**
 * @namespace Lightship
 */
if (!self.Lightship) self.Lightship = {};




/**
 * @class Lightship.Environment
 * @abstract
 * @extends Batten.Environment
 * @constructor
 */
Lightship.Environment = Ok.extendObject(Batten.Environment);

Lightship.Environment.getBaseChain = function () {
	return this._le_baseChain;
};

Lightship.Environment.init = function (aOptions) {
	var options = Ok.objectAssign({
		baseChain: null
	}, aOptions);

	this._le_baseChain = options.baseChain;
};
