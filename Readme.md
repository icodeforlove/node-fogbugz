# simple to use

if you have a token you can do this

	var FogBugz = require('node-fogbugz'),
		fogbugz = new FogBugz({endpoint: 'http://domain.com/FogBugz/api.asp', token: 'vspd3eggg4'});

if you need one you can do this

	var FogBugz = require('node-fogbugz'),
		fogbugz = new FogBugz({endpoint: 'http://domain.com/FogBugz/api.asp'});

	fogbugz.authenticate('email@email.com', 'password', function (error, token) {
		fogbugz.setToken(token);
	});