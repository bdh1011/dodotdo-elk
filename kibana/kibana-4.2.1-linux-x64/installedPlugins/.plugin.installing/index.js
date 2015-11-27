var Promise = require('bluebird');
var join = require('path').join;
var requireAllAndApply = require('./server/lib/require_all_and_apply');
var ensureMarvelIndex = require('./server/lib/ensure_marvel_index');

module.exports = function (kibana) {
  return new kibana.Plugin({
    require: ['elasticsearch'],
    name: 'marvel',

    uiExports: {
      app: {
        title: 'Marvel',
        description: 'Monitoring for Elasticsearch',
        main: 'plugins/marvel/marvel',
        injectVars: function (server, options) {
          var config = server.config();
          return {
            maxBucketSize: config.get('marvel.max_bucket_size'),
            kbnIndex: config.get('kibana.index'),
            esApiVersion: config.get('elasticsearch.apiVersion'),
            esShardTimeout: config.get('elasticsearch.shardTimeout'),
            statsReportUrl: config.get('marvel.stats_report_url'),
            reportStats: config.get('marvel.report_stats'),
            marvelIndexPrefix: config.get('marvel.index_prefix'),
            googleTagManagerId: config.get('marvel.google_tag_manager_id')
          };
        }
      },
      modules: {
        'angular-resource$': {
          path: require.resolve('angular-resource'),
          imports: 'angular'
        },
        'react$': require.resolve('react')
      }
    },

    config: function (Joi) {
      return Joi.object({
        enabled: Joi.boolean().default(true),
        index: Joi.string().default('.marvel-es-data'),
        index_prefix: Joi.string().default('.marvel-es-'),
        missing_intervals: Joi.number().default(12),
        max_bucket_size: Joi.number().default(10000),
        report_stats: Joi.boolean().default(true),
        google_tag_manager_id: Joi.string().default('GTM-WXMHGM'),
        stats_report_url: Joi.when('$dev', {
          is: true,
          then: Joi.string().default('/marvel/api/v1/phone-home'),
          otherwise: Joi.string().default('https://marvel-stats.elasticsearch.com/')
        }),
        agent: Joi.object({
          interval: Joi.string().regex(/[\d\.]+[yMwdhms]/).default('10s')
        }).default()
      }).default();
    },

    init: function (server, options) {
      // Make sure the Marvel index is created
      ensureMarvelIndex(this, server);
      // Require all the routes
      requireAllAndApply(join(__dirname, 'server', 'routes', '**', '*.js'), server);
    }
  });
};
