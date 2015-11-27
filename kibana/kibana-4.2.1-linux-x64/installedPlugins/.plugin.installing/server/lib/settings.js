var root = require('requirefrom')('');
var Model = root('public/lib/model');
var settingSchemas = root('server/lib/setting_schemas');
var Joi = require('joi');
var stripDefaults = root('server/lib/strip_defaults');
var moment = require('moment');

module.exports = function settingsModelProvider(server) {
  var callWithRequest = server.plugins.elasticsearch.callWithRequest;
  var config = server.config();
  var index = config.get('marvel.index');

  function Settings(data, options) {
    Model.call(this, data, options);
    this.options.stripEmpties = true;
  }

  Settings.prototype = new Model();

  Settings.prototype.validate = function () {
    var parts = this.get('_id').split(/:/);
    var cluster = parts[0];
    var id = parts[1];
    var schema = settingSchemas[id];
    if (!schema) throw new Error('Schema missing for ' + id);
    var valid = Joi.validate(Model.flatten(this.data), schema);
    if (valid.error) {
      throw valid.error;
    }
    this.set(valid.value);
  };

  Settings.prototype.save = function (options) {
    this.set('_updated', moment.utc().toISOString());
    options = options || {};
    var id = this.get('_id');
    var data = this.data;
    var req = options.req;
    if (options.stripDefaults) {
      var parts = this.get('_id').split(/:/);
      var schema = settingSchemas[parts[1]];
      data = stripDefaults(data, schema);
    }
    var self = this;
    var params = {
      index: index,
      type: 'settings',
      id: id,
      body: Model.explode(data)
    };
    return callWithRequest(req, 'index', params).then(function (resp) {
      return self;
    });
  };

  Settings.fetchById = function (options) {
    var params = {
      index: index,
      type: 'settings',
      id: options.id
    };
    return callWithRequest(options.req, 'get', params).then(function (resp) {
      var settings = new Settings(resp._source);
      settings.validate();
      return settings;
    });
  };

  Settings.fetchOrCreate = function (id) {
    return Settings.fetchById(id).catch(function () {
      var settings = new Settings({ _id: id });
      settings.validate();
      return settings;
    });
  };

  Settings.bulkFetch = function (options) {
    var params = {
      index: config.get('marvel.index'),
      type: 'settings',
      body: { ids: options.ids }
    };
    return callWithRequest(options.req, 'mget', params).then(function (resp) {
      var results = resp.docs.map(function (doc) {
        var value = (doc.found) ? doc._source : {};
        value._id = doc._id;
        var settings = new Settings(value);
        settings.validate();
        return settings;
      });
      return results;
    });
  };

  return Settings;

};
