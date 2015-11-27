var root = require('requirefrom')('');
var _ = require('lodash');
var Joi = require('joi');
var flatten = root('public/lib/model').flatten;

module.exports = function (body, schema) {
  var target = flatten(body);
  var defaults = flatten(Joi.validate({}, schema).value);
  _.each(defaults, function (val, key) {
    if (target[key] === defaults[key]) delete target[key];
  });
  return target;
};
