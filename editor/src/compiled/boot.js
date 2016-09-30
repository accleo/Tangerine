Tangerine.bootSequence = {
  basicConfig: function(callback) {
    var locationPath, urlParser;
    $.couch.urlPrefix = '/db';
    locationPath = window.location.pathname.split("/");
    Tangerine.db_name = locationPath[2];
    Tangerine.design_doc = "ojai";
    Tangerine.$db = $.couch.db(Tangerine.db_name);
    urlParser = document.createElement("a");
    urlParser.href = window.location;
    Backbone.couch_connector.config.base_url = urlParser.protocol + "//" + urlParser.host + "/db";
    Backbone.couch_connector.config.db_name = Tangerine.db_name;
    Backbone.couch_connector.config.ddoc_name = Tangerine.design_doc;
    Backbone.couch_connector.config.global_changes = false;
    _.templateSettings = {
      interpolate: /\{\{(.+?)\}\}/g
    };
    return callback();
  },
  versionTag: function(callback) {
    $("#footer").append("<div id='version'>" + Tangerine.version + "-" + Tangerine.build + "</div>");
    return callback();
  },
  fetchConfiguration: function(callback) {
    Tangerine.config = new Config({
      "_id": "configuration"
    });
    return Tangerine.config.fetch({
      error: function() {
        var rootPath;
        console.log("Could not fetch configuration; need to login.");
        rootPath = window.location.origin;
        return window.location = rootPath;
      },
      success: callback
    });
  },
  fetchSettings: function(callback) {
    Tangerine.settings = new Settings({
      "_id": "settings"
    });
    return Tangerine.settings.fetch({
      success: callback,
      error: function() {
        var defaultSettings, ref;
        defaultSettings = (ref = Tangerine.config.get("defaults")) != null ? ref.settings : void 0;
        if (defaultSettings == null) {
          alert("Missing default settings in configuration");
        }
        Tangerine.settings.set(defaultSettings);
        return Tangerine.settings.save(null, {
          error: function() {
            return alert("Could not save default settings");
          },
          success: callback
        });
      }
    });
  },
  guaranteeInstanceId: function(callback) {
    if (!Tangerine.settings.has("instanceId")) {
      return Tangerine.settings.save({
        "instanceId": Utils.humanGUID()
      }, {
        error: function() {
          return alert("Could not save new Instance Id");
        },
        success: callback
      });
    } else {
      return callback();
    }
  },
  fetchTemplates: function(callback) {
    return (Tangerine.templates = new Template({
      "_id": "templates"
    })).fetch({
      error: function() {
        return alert("Could not load templates.");
      },
      success: callback
    });
  },
  documentReady: function(callback) {
    return $(function() {
      return callback();
    });
  },
  loadI18n: function(callback) {
    return i18n.init({
      fallbackLng: "en-US",
      lng: Tangerine.settings.get("language"),
      resStore: Tangerine.locales
    }, function() {
      window.t = i18n.t;
      return callback();
    });
  },
  loadSingletons: function(callback) {
    window.vm = new ViewManager();
    Tangerine.router = new Router();
    Tangerine.user = new User();
    Tangerine.nav = new NavigationView({
      user: Tangerine.user,
      router: Tangerine.router
    });
    Tangerine.log = new Log();
    return callback();
  },
  reloadUserSession: function(callback) {
    return Tangerine.user.sessionRefresh({
      error: function() {
        return Tangerine.user.logout();
      },
      success: function() {
        return callback();
      }
    });
  },
  startBackbone: function(callback) {
    Backbone.history.start();
    return callback();
  }
};

Tangerine["enum"] = {
  subjects: {
    1: "Afaan Oromo",
    2: "Af-Somali",
    3: "Amharic",
    4: "Hadiyyisa",
    5: "Sidaamu Afoo",
    6: "Tigrinya",
    7: "Wolayttatto"
  },
  iSubjects: {
    "Afaan Oromo": "1",
    "Af-Somali": "2",
    "Amharic": "3",
    "Hadiyyisa": "4",
    "Sidaamu Afoo": "5",
    "Tigrinya": "6",
    "Wolayttatto": "7"
  }
};

Tangerine.boot = function(callback) {
  var sequence;
  sequence = [Tangerine.bootSequence.basicConfig, Tangerine.bootSequence.versionTag, Tangerine.bootSequence.fetchConfiguration, Tangerine.bootSequence.fetchSettings, Tangerine.bootSequence.guaranteeInstanceId, Tangerine.bootSequence.fetchTemplates, Tangerine.bootSequence.documentReady, Tangerine.bootSequence.loadI18n, Tangerine.bootSequence.loadSingletons, Tangerine.bootSequence.reloadUserSession, Tangerine.bootSequence.startBackbone];
  if (callback != null) {
    sequence.push(callback);
  }
  return Utils.execute(sequence);
};

Tangerine.boot();

//# sourceMappingURL=data:application/json;base64,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QVksQ0FBQyxXQURkLEVBRVQsU0FBUyxDQUFDLFlBQVksQ0FBQyxVQUZkLEVBR1QsU0FBUyxDQUFDLFlBQVksQ0FBQyxrQkFIZCxFQUlULFNBQVMsQ0FBQyxZQUFZLENBQUMsYUFKZCxFQUtULFNBQVMsQ0FBQyxZQUFZLENBQUMsbUJBTGQsRUFNVCxTQUFTLENBQUMsWUFBWSxDQUFDLGNBTmQsRUFPVCxTQUFTLENBQUMsWUFBWSxDQUFDLGFBUGQsRUFRVCxTQUFTLENBQUMsWUFBWSxDQUFDLFFBUmQsRUFTVCxTQUFTLENBQUMsWUFBWSxDQUFDLGNBVGQsRUFVVCxTQUFTLENBQUMsWUFBWSxDQUFDLGlCQVZkLEVBV1QsU0FBUyxDQUFDLFlBQVksQ0FBQyxhQVhkO0VBY1gsSUFBMEIsZ0JBQTFCO0lBQUEsUUFBUSxDQUFDLElBQVQsQ0FBYyxRQUFkLEVBQUE7O1NBRUEsS0FBSyxDQUFDLE9BQU4sQ0FBYyxRQUFkO0FBbEJlOztBQW9CakIsU0FBUyxDQUFDLElBQVYsQ0FBQSIsImZpbGUiOiJhcHAvYm9vdC5qcyIsInNvdXJjZVJvb3QiOiIvc291cmNlLyIsInNvdXJjZXNDb250ZW50IjpbIiMgVGhpcyBmaWxlIGxvYWRzIHRoZSBtb3N0IGJhc2ljIHNldHRpbmdzIHJlbGF0ZWQgdG8gVGFuZ2VyaW5lIGFuZCBraWNrcyBvZmYgQmFja2JvbmUncyByb3V0ZXIuXG4jICAgKiBUaGUgZG9jIGBjb25maWd1cmF0aW9uYCBob2xkcyB0aGUgbWFqb3JpdHkgb2Ygc2V0dGluZ3MuXG4jICAgKiBUaGUgU2V0dGluZ3Mgb2JqZWN0IGNvbnRhaW5zIG1hbnkgY29udmVuaWVuY2UgZnVuY3Rpb25zIHRoYXQgdXNlIGNvbmZpZ3VyYXRpb24ncyBkYXRhLlxuIyAgICogVGVtcGxhdGVzIHNob3VsZCBjb250YWluIG9iamVjdHMgYW5kIGNvbGxlY3Rpb25zIG9mIG9iamVjdHMgcmVhZHkgdG8gYmUgdXNlZCBieSBhIEZhY3RvcnkuXG4jIEFsc28gaW50aWFsaXplZCBoZXJlIGFyZTogQmFja2JvbmUuanMsIGFuZCBqUXVlcnkuaTE4blxuIyBBbnl0aGluZyB0aGF0IGZhaWxzIGJhZCBoZXJlIHNob3VsZCBwcm9iYWJseSBiZSBmYWlsaW5nIGluIGZyb250IG9mIHRoZSB1c2VyLlxuXG4jIFV0aWxzLmRpc2FibGVDb25zb2xlTG9nKClcbiMgVXRpbHMuZGlzYWJsZUNvbnNvbGVBc3NlcnQoKVxuXG5UYW5nZXJpbmUuYm9vdFNlcXVlbmNlID1cblxuICAjIEJhc2ljIGNvbmZpZ3VyYXRpb25cblxuICBiYXNpY0NvbmZpZyA6IChjYWxsYmFjaykgLT5cblxuICAgICQuY291Y2gudXJsUHJlZml4ID0gJy9kYidcblxuICAgIGxvY2F0aW9uUGF0aCA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5zcGxpdChcIi9cIilcbiAgICBUYW5nZXJpbmUuZGJfbmFtZSAgICA9IGxvY2F0aW9uUGF0aFsyXVxuICAgIFRhbmdlcmluZS5kZXNpZ25fZG9jID0gXCJvamFpXCJcblxuICAgICMgTG9jYWwgdGFuZ2VyaW5lIGRhdGFiYXNlIGhhbmRsZVxuICAgIFRhbmdlcmluZS4kZGIgPSAkLmNvdWNoLmRiKFRhbmdlcmluZS5kYl9uYW1lKVxuXG4gICAgdXJsUGFyc2VyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIilcbiAgICB1cmxQYXJzZXIuaHJlZiA9IHdpbmRvdy5sb2NhdGlvblxuXG4gICAgIyBCYWNrYm9uZSBjb25maWd1cmF0aW9uXG4gICAgQmFja2JvbmUuY291Y2hfY29ubmVjdG9yLmNvbmZpZy5iYXNlX3VybCAgPSBcIiN7dXJsUGFyc2VyLnByb3RvY29sfS8vI3t1cmxQYXJzZXIuaG9zdH0vZGJcIlxuICAgIEJhY2tib25lLmNvdWNoX2Nvbm5lY3Rvci5jb25maWcuZGJfbmFtZSAgID0gVGFuZ2VyaW5lLmRiX25hbWVcbiAgICBCYWNrYm9uZS5jb3VjaF9jb25uZWN0b3IuY29uZmlnLmRkb2NfbmFtZSA9IFRhbmdlcmluZS5kZXNpZ25fZG9jXG4gICAgQmFja2JvbmUuY291Y2hfY29ubmVjdG9yLmNvbmZpZy5nbG9iYWxfY2hhbmdlcyA9IGZhbHNlXG5cbiAgICAjIHNldCB1bmRlcnNjb3JlJ3MgdGVtcGxhdGUgZW5naW5lIHRvIGFjY2VwdCBoYW5kbGViYXItc3R5bGUgdmFyaWFibGVzXG4gICAgXy50ZW1wbGF0ZVNldHRpbmdzID0gaW50ZXJwb2xhdGUgOiAvXFx7XFx7KC4rPylcXH1cXH0vZ1xuXG4gICAgY2FsbGJhY2soKVxuXG4gICMgUHV0IHRoaXMgdmVyc2lvbidzIGluZm9ybWF0aW9uIGluIHRoZSBmb290ZXJcbiAgdmVyc2lvblRhZzogKCBjYWxsYmFjayApIC0+XG4gICAgJChcIiNmb290ZXJcIikuYXBwZW5kKFwiPGRpdiBpZD0ndmVyc2lvbic+I3tUYW5nZXJpbmUudmVyc2lvbn0tI3tUYW5nZXJpbmUuYnVpbGR9PC9kaXY+XCIpXG4gICAgY2FsbGJhY2soKVxuXG4gICMgR3JhYiBvdXIgc3lzdGVtIGNvbmZpZyBkb2MuIFRoZXNlIGdlbmVyYWxseSBkb24ndCBjaGFuZ2UgdmVyeSBvZnRlbiB1bmxlc3NcbiAgIyBtYWpvciBzeXN0ZW0gY2hhbmdlcyBhcmUgcmVxdWlyZWQuIE5ldyBzZXJ2ZXJzLCBldGMuXG4gIGZldGNoQ29uZmlndXJhdGlvbjogKCBjYWxsYmFjayApIC0+XG5cbiAgICBUYW5nZXJpbmUuY29uZmlnID0gbmV3IENvbmZpZyBcIl9pZFwiIDogXCJjb25maWd1cmF0aW9uXCJcbiAgICBUYW5nZXJpbmUuY29uZmlnLmZldGNoXG4gICAgICBlcnJvciAgIDogLT5cbiAgICAgICAgY29uc29sZS5sb2cgXCJDb3VsZCBub3QgZmV0Y2ggY29uZmlndXJhdGlvbjsgbmVlZCB0byBsb2dpbi5cIlxuIyAgICAgICAgcmVkaXJlY3QgdG8gbG9naW5cbiAgICAgICAgcm9vdFBhdGggPSB3aW5kb3cubG9jYXRpb24ub3JpZ2luXG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbiA9IHJvb3RQYXRoXG4gICAgICBzdWNjZXNzIDogY2FsbGJhY2tcblxuXG5cbiAgIyBnZXQgb3VyIGxvY2FsIFRhbmdlcmluZSBzZXR0aW5nc1xuICAjIHRoZXNlIGRvIHRlbmQgdG8gY2hhbmdlIGRlcGVuZGluZyBvbiB0aGUgcGFydGljdWxhciBpbnN0YWxsIG9mIHRoZVxuICBmZXRjaFNldHRpbmdzIDogKCBjYWxsYmFjayApIC0+XG4gICAgVGFuZ2VyaW5lLnNldHRpbmdzID0gbmV3IFNldHRpbmdzIFwiX2lkXCIgOiBcInNldHRpbmdzXCJcbiAgICBUYW5nZXJpbmUuc2V0dGluZ3MuZmV0Y2hcbiAgICAgIHN1Y2Nlc3M6IGNhbGxiYWNrXG5cbiAgICAgIGVycm9yOiAtPlxuICAgICAgICBkZWZhdWx0U2V0dGluZ3MgPSBUYW5nZXJpbmUuY29uZmlnLmdldChcImRlZmF1bHRzXCIpPy5zZXR0aW5nc1xuICAgICAgICBhbGVydCBcIk1pc3NpbmcgZGVmYXVsdCBzZXR0aW5ncyBpbiBjb25maWd1cmF0aW9uXCIgdW5sZXNzIGRlZmF1bHRTZXR0aW5ncz9cblxuICAgICAgICBUYW5nZXJpbmUuc2V0dGluZ3Muc2V0IGRlZmF1bHRTZXR0aW5ncyAjIEB0b2RvLCBmaWd1cmUgb3V0IHdoeSBzYXZlLCBvbmx5IGNhbGxzIGJlZm9yZXNhdmVcbiAgICAgICAgVGFuZ2VyaW5lLnNldHRpbmdzLnNhdmUgbnVsbCxcbiAgICAgICAgICBlcnJvcjogLT4gYWxlcnQgXCJDb3VsZCBub3Qgc2F2ZSBkZWZhdWx0IHNldHRpbmdzXCJcbiAgICAgICAgICBzdWNjZXNzOiBjYWxsYmFja1xuXG5cbiAgIyBmb3IgdXBncmFkZXNcbiAgZ3VhcmFudGVlSW5zdGFuY2VJZDogKCBjYWxsYmFjayApIC0+XG4gICAgdW5sZXNzIFRhbmdlcmluZS5zZXR0aW5ncy5oYXMoXCJpbnN0YW5jZUlkXCIpXG4gICAgICBUYW5nZXJpbmUuc2V0dGluZ3Muc2F2ZVxuICAgICAgICBcImluc3RhbmNlSWRcIiA6IFV0aWxzLmh1bWFuR1VJRCgpXG4gICAgICAsXG4gICAgICAgIGVycm9yOiAtPiBhbGVydCBcIkNvdWxkIG5vdCBzYXZlIG5ldyBJbnN0YW5jZSBJZFwiXG4gICAgICAgIHN1Y2Nlc3M6IGNhbGxiYWNrXG4gICAgZWxzZVxuICAgICAgY2FsbGJhY2soKVxuXG4gICMgbG9hZCB0ZW1wbGF0ZXNcbiAgZmV0Y2hUZW1wbGF0ZXM6ICggY2FsbGJhY2sgKSAtPlxuICAgIChUYW5nZXJpbmUudGVtcGxhdGVzID0gbmV3IFRlbXBsYXRlIFwiX2lkXCIgOiBcInRlbXBsYXRlc1wiKS5mZXRjaFxuICAgICAgZXJyb3I6IC0+IGFsZXJ0IFwiQ291bGQgbm90IGxvYWQgdGVtcGxhdGVzLlwiXG4gICAgICBzdWNjZXNzOiBjYWxsYmFja1xuXG5cblxuICBkb2N1bWVudFJlYWR5OiAoIGNhbGxiYWNrICkgLT4gJCAtPlxuXG4gICAgIyQoXCI8YnV0dG9uIGlkPSdyZWxvYWQnPnJlbG9hZCBtZTwvYnV0dG9uPlwiKS5hcHBlbmRUbyhcIiNmb290ZXJcIikuY2xpY2sgLT4gZG9jdW1lbnQubG9jYXRpb24ucmVsb2FkKClcblxuICAgIGNhbGxiYWNrKClcblxuICBsb2FkSTE4bjogKCBjYWxsYmFjayApIC0+XG4gICAgaTE4bi5pbml0XG4gICAgICBmYWxsYmFja0xuZyA6IFwiZW4tVVNcIlxuICAgICAgbG5nICAgICAgICAgOiBUYW5nZXJpbmUuc2V0dGluZ3MuZ2V0KFwibGFuZ3VhZ2VcIilcbiAgICAgIHJlc1N0b3JlICAgIDogVGFuZ2VyaW5lLmxvY2FsZXNcbiAgICAsIC0+XG4gICAgICB3aW5kb3cudCA9IGkxOG4udFxuICAgICAgY2FsbGJhY2soKVxuXG4gIGxvYWRTaW5nbGV0b25zOiAoIGNhbGxiYWNrICkgLT5cbiAgICAjIFNpbmdsZXRvbnNcbiAgICB3aW5kb3cudm0gPSBuZXcgVmlld01hbmFnZXIoKVxuICAgIFRhbmdlcmluZS5yb3V0ZXIgPSBuZXcgUm91dGVyKClcbiAgICBUYW5nZXJpbmUudXNlciAgID0gbmV3IFVzZXIoKVxuICAgIFRhbmdlcmluZS5uYXYgICAgPSBuZXcgTmF2aWdhdGlvblZpZXdcbiAgICAgIHVzZXIgICA6IFRhbmdlcmluZS51c2VyXG4gICAgICByb3V0ZXIgOiBUYW5nZXJpbmUucm91dGVyXG4gICAgVGFuZ2VyaW5lLmxvZyAgICA9IG5ldyBMb2coKVxuICAgIGNhbGxiYWNrKClcblxuICByZWxvYWRVc2VyU2Vzc2lvbjogKCBjYWxsYmFjayApIC0+XG5cbiAgICBUYW5nZXJpbmUudXNlci5zZXNzaW9uUmVmcmVzaFxuICAgICAgZXJyb3I6IC0+IFRhbmdlcmluZS51c2VyLmxvZ291dCgpXG4gICAgICBzdWNjZXNzOiAtPiBjYWxsYmFjaygpXG5cbiAgc3RhcnRCYWNrYm9uZTogKCBjYWxsYmFjayApIC0+XG4gICAgQmFja2JvbmUuaGlzdG9yeS5zdGFydCgpXG4gICAgY2FsbGJhY2soKSAjIGZvciB0ZXN0aW5nXG5cblRhbmdlcmluZS5lbnVtID1cbiAgc3ViamVjdHMgOlxuICAgIDEgOiBcIkFmYWFuIE9yb21vXCJcbiAgICAyIDogXCJBZi1Tb21hbGlcIlxuICAgIDMgOiBcIkFtaGFyaWNcIlxuICAgIDQgOiBcIkhhZGl5eWlzYVwiXG4gICAgNSA6IFwiU2lkYWFtdSBBZm9vXCJcbiAgICA2IDogXCJUaWdyaW55YVwiXG4gICAgNyA6IFwiV29sYXl0dGF0dG9cIlxuICBpU3ViamVjdHMgOlxuICAgIFwiQWZhYW4gT3JvbW9cIjogXCIxXCJcbiAgICBcIkFmLVNvbWFsaVwiIDogXCIyXCJcbiAgICBcIkFtaGFyaWNcIiA6IFwiM1wiXG4gICAgXCJIYWRpeXlpc2FcIiA6IFwiNFwiXG4gICAgXCJTaWRhYW11IEFmb29cIiA6IFwiNVwiXG4gICAgXCJUaWdyaW55YVwiIDogXCI2XCJcbiAgICBcIldvbGF5dHRhdHRvXCIgOiBcIjdcIlxuXG4jIGNhbGxiYWNrIGlzIHVzZWQgZm9yIHRlc3RpbmdcblRhbmdlcmluZS5ib290ID0gKGNhbGxiYWNrKSAtPlxuXG4gIHNlcXVlbmNlID0gW1xuICAgIFRhbmdlcmluZS5ib290U2VxdWVuY2UuYmFzaWNDb25maWdcbiAgICBUYW5nZXJpbmUuYm9vdFNlcXVlbmNlLnZlcnNpb25UYWdcbiAgICBUYW5nZXJpbmUuYm9vdFNlcXVlbmNlLmZldGNoQ29uZmlndXJhdGlvblxuICAgIFRhbmdlcmluZS5ib290U2VxdWVuY2UuZmV0Y2hTZXR0aW5nc1xuICAgIFRhbmdlcmluZS5ib290U2VxdWVuY2UuZ3VhcmFudGVlSW5zdGFuY2VJZFxuICAgIFRhbmdlcmluZS5ib290U2VxdWVuY2UuZmV0Y2hUZW1wbGF0ZXNcbiAgICBUYW5nZXJpbmUuYm9vdFNlcXVlbmNlLmRvY3VtZW50UmVhZHlcbiAgICBUYW5nZXJpbmUuYm9vdFNlcXVlbmNlLmxvYWRJMThuXG4gICAgVGFuZ2VyaW5lLmJvb3RTZXF1ZW5jZS5sb2FkU2luZ2xldG9uc1xuICAgIFRhbmdlcmluZS5ib290U2VxdWVuY2UucmVsb2FkVXNlclNlc3Npb25cbiAgICBUYW5nZXJpbmUuYm9vdFNlcXVlbmNlLnN0YXJ0QmFja2JvbmVcbiAgXVxuXG4gIHNlcXVlbmNlLnB1c2ggY2FsbGJhY2sgaWYgY2FsbGJhY2s/XG5cbiAgVXRpbHMuZXhlY3V0ZSBzZXF1ZW5jZVxuXG5UYW5nZXJpbmUuYm9vdCgpXG5cblxuXG5cbiJdfQ==
