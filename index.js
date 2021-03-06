/**  @author Gilles Coomans <gilles.coomans@gmail.com> */
(function() {
	'use strict';
	var aright = require('aright'),
		y = require('yamvish');

	y.aright = aright;

	y.Template.prototype.validate = function(path, rule) {
		return this.context(function(context) {
			context.validate(path, rule);
		});
	};

	y.Context.prototype.validate = function(path, rule) {
		// subscribe on path then use validator to produce errors (if any) and place it in context.data.$error 
		var self = this;

		var applyValidation = function(value, type, path, key) {
			var report;
			if (type === 'push') // validate whole array ?
				report = rule.validate(self.get(path));
			else if (type !== 'removeAt')
				report = rule.validate(value);
			if (report !== true)
				self.set('$error.' + path, report);
			else
				self.del('$error.' + path);
		};

		this.subscribe(path, applyValidation);
		var val = this.get(path);
		if (typeof val !== 'undefined')
			applyValidation(val, 'set');
		return this;
	};

	module.exports = aright;
})();
