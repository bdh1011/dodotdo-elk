var _ = require('lodash');
var Joi = require('joi');
var Boom = require('boom');
var root = require('requirefrom')('');
var settingSchemas = root('server/lib/setting_schemas');
var settingsModelProvider = root('server/lib/settings');
var getClusters = require('../../lib/get_clusters');

module.exports = function (server) {
  var config = server.config();
  var index = config.get('marvel.index');
  var Settings = settingsModelProvider(server);

  server.route({
    method: 'GET',
    path: '/marvel/api/v1/settings',
    handler: function (req, reply) {
      getClusters(req).then((clusters) => {
        var cluster = req.query.cluster;
        var clusterKeys = cluster && [cluster] || _.map(clusters, (cluster) => cluster.cluster_uuid);
        var keys = [];
        _.each(clusterKeys, function (cluster) {
          _.each(_.keys(settingSchemas), function (key) {
            keys.push(cluster + ':' + key);
          });
        });
        Settings.bulkFetch({ ids: keys, req: req }).then(function (docs) {
          reply(docs);
        });
      }).catch(reply);
    }
  });

  server.route({
    method: 'GET',
    path: '/marvel/api/v1/settings/{id}',
    handler: function (req, reply) {
      var parts = req.params.id.split(/:/);
      var schema = settingSchemas[parts[1]];
      if (!schema) return reply(Boom.notFound('Resouce does not exist.'));
      return Settings.fetchById({ req: req, id: req.params.id })
        .then(function (settings) {
          reply(settings);
        })
        .catch(function (err) {
          if (err.isBoom) return reply(err);
          var id = req.params.cluster + ':' + req.params.id;
          var settings = new Settings({ _id: id });
          reply(settings);
        });
    }
  });

  server.route({
    method: [ 'PUT', 'POST' ],
    path: '/marvel/api/v1/settings/{id}',
    config: {
      validate: {
        payload: function (value, options, next) {
          var parts = options.context.params.id.split(/:/);
          var schema = settingSchemas[parts[1]];
          if (!schema) return next(Boom.notFound('Resouce does not exist'));
          var settings = new Settings(value);
          settings.validate();
          next(null, settings);
        }
      }
    },
    handler: function (req, reply) {
      var settings = req.payload;
      settings.save({ req: req, stripDefaults: true })
        .then(function (doc) {
          reply(doc).code(201);
        })
        .catch(reply);
    }
  });

};
