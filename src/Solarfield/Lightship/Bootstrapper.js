/**
 * {@link http://github.com/solarfield/lightship-js}
 * {@license https://github.com/solarfield/lightship-js/blob/master/LICENSE}
 */

define(
	[],
	function () {
		"use strict";
		
		const Bootstrapper = function () {
			throw new Error("Class is abstract.");
		};
		
		Bootstrapper.go = function (aOptions) {
			return new Promise(function (resolve) {
				const includes = aOptions.jsModules||[];
				includes.unshift('app/App/Controller');
				includes.unshift('app/App/Environment');
				
				resolve(Promise.all(includes.map(function (include) {return System.import(include)})));
			})
			.then(function (r) {
				const Environment = r[0];
				const Controller = r[1];
				
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