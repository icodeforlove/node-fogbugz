/*jslint node:true*/
// FogBugz API v8
var xml2js = require('xml2js'),
    rest = require('restler'),
    url = require('url'),
    querystring = require('querystring');

function FogBugz($config) {
  this.endpoint = $config.endpoint + '?';
  this.token = $config.token || null;
}

FogBugz.prototype.setToken = function (token) {
  this.token = token;
};

FogBugz.prototype.authenticate = function(email, password, callback) {
  var q = querystring.stringify({cmd: 'logon', email: email, password: password});
  var request = rest.get(this.endpoint + q, { parser: rest.parsers.xml });
  this._unwind(request, 'token', callback);
};

FogBugz.prototype.allProjects = function(callback) {
  var q = querystring.stringify({token: this.token, cmd: 'listProjects', fwrite: 1});
  var request = rest.get(this.endpoint + q, { parser: rest.parsers.xml });
  this._unwind(request, 'projects.project', callback);
};

FogBugz.prototype.allPeople = function(projectID, callback) {
  var q = querystring.stringify({token: this.token, cmd: 'listPeople'});
  var request = rest.get(this.endpoint + q, { parser: rest.parsers.xml });
  this._unwind(request, 'people.person', callback);
};

FogBugz.prototype.allActiveMilestones = function(projectID, callback) {
  var q = querystring.stringify({token: this.token, cmd: 'listFixFors', ixProject: projectID});
  var request = rest.get(this.endpoint + q, { parser: rest.parsers.xml });
  this._unwind(request, 'fixfors.fixfor', callback);
};

FogBugz.prototype.allMilestones = function(projectID, callback) {
  var q = querystring.stringify({token: this.token, cmd: 'listFixFors', ixProject: projectID, fIncludeDeleted: 1});
  var request = rest.get(this.endpoint + q, { parser: rest.parsers.xml });
  this._unwind(request, 'fixfors.fixfor', callback);
};

FogBugz.prototype.allAreas = function(projectID, callback) {
  var q = querystring.stringify({token: this.token, cmd: 'listAreas', ixProject: projectID});
  var request = rest.get(this.endpoint + q, { parser: rest.parsers.xml });
  this._unwind(request, 'areas.area', callback);
};

FogBugz.prototype.allPriorities = function(token, callback) {
  var q = querystring.stringify({token: this.token, cmd: 'listPriorities'});
  var request = rest.get(this.endpoint + q, { parser: rest.parsers.xml });
  this._unwind(request, 'priorities.priority', callback);
};

FogBugz.prototype.allCategories = function(token, callback) {
  var q = querystring.stringify({token: this.token, cmd: 'listCategories'});
  var request = rest.get(this.endpoint + q, { parser: rest.parsers.xml });
  this._unwind(request, 'categories.category', callback);
};

FogBugz.prototype.allStatuses = function(token, callback) {
  var q = querystring.stringify({token: this.token, cmd: 'listStatuses'});
  var request = rest.get(this.endpoint + q, { parser: rest.parsers.xml });
  this._unwind(request, 'statuses.status', callback);
};

FogBugz.prototype.newCase = function(values, callback) {
  var q = querystring.stringify({token: this.token, cmd: 'new'});
  var request = rest.post(this.endpoint + q, { parser: rest.parsers.xml, data: values });
  this._unwind(request, 'case', callback);
};

FogBugz.prototype.editCase = function(values, callback) {
  var q = querystring.stringify({token: this.token, cmd: 'edit'});
  var request = rest.post(this.endpoint + q, { parser: rest.parsers.xml, data: values });
  this._unwind(request, 'case', callback);
};

FogBugz.prototype.reopenCase = function(values, callback) {
  var q = querystring.stringify({token: this.token, cmd: 'reopen'});
  var request = rest.post(this.endpoint + q, { parser: rest.parsers.xml, data: values });
  this._unwind(request, 'case', callback);
};

FogBugz.prototype.reactivateCase = function(values, callback) {
  var q = querystring.stringify({token: this.token, cmd: 'reactivate'});
  var request = rest.post(this.endpoint + q, { parser: rest.parsers.xml, data: values });
  this._unwind(request, 'case', callback);
};

FogBugz.prototype.resolveCase = function(values, callback) {
  var q = querystring.stringify({token: this.token, cmd: 'resolve'});
  var request = rest.post(this.endpoint + q, { parser: rest.parsers.xml, data: values });
  this._unwind(request, 'case', callback);
};

FogBugz.prototype.closeCase = function(values, callback) {
  var q = querystring.stringify({token: this.token, cmd: 'close'});
  var request = rest.post(this.endpoint + q, { parser: rest.parsers.xml, data: values });
  this._unwind(request, 'case', callback);
};

FogBugz.prototype.startWork = function(caseID, callback) {
  var q = querystring.stringify({token: this.token, cmd: 'startWork'});
  var request = rest.post(this.endpoint + q, { parser: rest.parsers.xml, data: {ixBug: caseID} });
  this._unwind(request, 'case', callback);
};

FogBugz.prototype.stopWork = function(token, callback) {
  var q = querystring.stringify({token: this.token, cmd: 'stopWork'});
  var request = rest.post(this.endpoint + q, { parser: rest.parsers.xml });
  this._unwind(request, 'case', callback);
};

FogBugz.prototype.timeIntervals = function(fromDate, callback) {
  var dateString = fromDate.getFullYear() + '-' + (fromDate.getMonth() + 1) + '-' + fromDate.getDate();
  var q = querystring.stringify({token: this.token, cmd: 'listIntervals', dtStart: dateString});
  var request = rest.get(this.endpoint + q, { parser: rest.parsers.xml });
  this._unwind(request, 'intervals.interval', callback);
};

FogBugz.prototype.cases = function(query, columns, limit, callback) {
  var q = { token: this.token, cols: columns, cmd: 'search', q: query, sFilter: 2 };
  if (limit) {
    q.max = limit;
  }
  q = querystring.stringify(q);
  var request = rest.get(this.endpoint + q, { parser: rest.parsers.xml });
  this._unwind(request, 'cases.case', callback);
};

FogBugz.prototype._unwind = function(request, keyPath, callback) {
  request.on('success', function(data) {
    
    var properties = keyPath.split('.');
    var object = data.response;
    for (var i=0; i<properties.length; i++) {
      var property = properties[i];

      if (object.hasOwnProperty(property)) {
        object = object[property];
      } else if (object.hasOwnProperty('error')) {
        callback(object.error['#'], null);
        return;
      } else {
        callback(null, object[0]);
        return;
      }
    }

    if (!object.length) object = [object];
    callback(null, object[0]);
    return;
  });

  request.on('error', function(data, response) {
    var error = response.message;
    callback(error, null);
    request.abort();
    return;
  });
};

module.exports = FogBugz;