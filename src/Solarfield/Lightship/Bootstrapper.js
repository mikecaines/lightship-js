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

		/**
		 * @param aOptions
		 * @return {Promise}
		 */
		Bootstrapper.go = function (aOptions) {
			return new Promise(function (resolve) {
				var includes = aOptions.jsModules||[];
				
				includes.unshift(
					'app/App/Environment',
					'solarfield/lightship-js/src/Solarfield/Lightship/Context',
					'solarfield/lightship-js/src/Solarfield/Lightship/Route'
				);
				
				resolve(Promise.all(includes.map(function (include) {return System.import(include)})));
			})
				.then(function (r) {
					var Environment = r[0];
					var Context = r[1];
					var Route = r[2];

					var environment = new Environment(aOptions.environmentOptions);
					environment.init();

					var context = new Context(new Route({
						moduleCode: aOptions.moduleCode,
						modelOptions: aOptions.modelOptions,
						controllerOptions: aOptions.controllerOptions,
					}));

					return environment.boot(context);
				})
				.then(function () {
					// erase any resolved value, as we expect none
				})
				.catch(function (e) {
					if (self.console && console.error) console.error('Bootstrap failed.', e);
					else throw e;
				});
		};
		
		return Bootstrapper;
	}
);
