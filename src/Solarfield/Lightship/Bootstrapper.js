/**
 * {@link http://github.com/solarfield/lightship-js}
 * {@license https://github.com/solarfield/lightship-js/blob/master/LICENSE}
 */

define(
	[],
	function () {
		"use strict";
		
		var Bootstrapper = function () {
			throw new Error("Class is abstract.");
		};
		
		Bootstrapper.go = function (aOptions) {
			return new Promise(function (resolve) {
				var includes = aOptions.jsModules||[];
				includes.unshift('app/App/Controller');
				includes.unshift('app/App/Environment');
				
				resolve(Promise.all(includes.map(function (include) {return System.import(include)})));
			})
			.then(function (r) {
				var Environment = r[0];
				var Controller = r[1];
				
				Environment.init(aOptions.environmentOptions);
				Controller.bootstrap(aOptions.controllerOptions);
				delete App.stub;
			})
			.catch(function (e) {
				if (self.console && console.error) console.error('Bootstrap failed.', e);
				else throw e;
			});
		};
		
		return Bootstrapper;
	}
);