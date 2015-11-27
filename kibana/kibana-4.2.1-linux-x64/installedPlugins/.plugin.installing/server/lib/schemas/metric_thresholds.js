var moment = require('moment');
var Joi = require('joi');
var root = require('requirefrom')('');
var _ = require('lodash');
var join = require('path').join;
var metrics = root('public/lib/metrics');
var thresholdPattern = /[<>=]{1,2}[\d\.]+/;

var schema = {
  _id: Joi.string(),
  _created: Joi.date().default(function () {
    return moment.utc().toISOString();
  }, 'created date'),
  _updated: Joi.date()
};

_.each(metrics, function (metric, field) {
  schema[field + '.warning'] = Joi.string().regex(thresholdPattern).default(metric.defaults.warning);
  schema[field + '.critical'] = Joi.string().regex(thresholdPattern).default(metric.defaults.critical);
  schema[field + '.interval'] = Joi.string().regex(/\d+[yMwdhms]/).default(metric.defaults.interval);
  schema[field + '.periods'] = Joi.number().min(1).default(metric.defaults.periods);
});

module.exports = Joi.object(schema).default();
