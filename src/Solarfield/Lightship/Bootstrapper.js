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
				
				includes.unshift(
					'app/App/Environment',
					'app/App/Controller',
					'solarfield/lightship-js/src/Solarfield/Lightship/Context',
					'solarfield/lightship-js/src/Solarfield/Lightship/Route'
				);
				
				resolve(Promise.all(includes.map(function (include) {return System.import(include)})));
			})
			.then(function (r) {
				var Environment = r[0];
				var Controller = r[1];
				var Context = r[2];
				var Route = r[3];
				
				var environment = new Environment();
				environment.init(aOptions.environmentOptions);
				
				var context = new Context(new Route({
					moduleCode: aOptions.controllerOptions.bootInfo.moduleCode,
					controllerOptions: aOptions.controllerOptions.bootInfo.controllerOptions,
				}));
				
				Controller.bootstrap(environment, context);
			})
			.catch(function (e) {
				if (self.console && console.error) console.error('Bootstrap failed.', e);
				else throw e;
			});
		};
		
		return Bootstrapper;
	}
);
