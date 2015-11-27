var _ = require('lodash');
var Promise = require('bluebird');
var moment = require('moment');
module.exports = function (client) {
  return function (pattern, start, end) {
    return new Promise(function (resolve, reject) {
      var options = {
        method: 'GET',
        path: pattern + '_field_stats',
        query: {
          level: 'indices',
          fields: 'timestamp',
          max: moment(start).valueOf(),
          min: moment(end).valueOf()
        }
      };
      client.transport.request(options, function (err, response) {
        if (err) return reject(err);
        var indices = _.map(response.indices, function (info, index) {
          return index;
        });
        resolve(indices);
      });
    });
  };
};
