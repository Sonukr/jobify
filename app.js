
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var mongoose = require('mongoose');

var Candidate = require('./api/candidate');
var Recruiter = require('./api/recruiter');
var Job       = require('./api/job');

var app = express();

// dbname - eventdb
mongoose.connect('mongodb://localhost/testprojectdb');

// all environments
app.set('port', process.env.PORT || 3000);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

var stub = function(req, res) {
  res.json({ msg: "not yet done" });
};

// API routes for job
app.get('/api/jobs', Job.get);
app.get('/api/jobs/:id', Job.getById);
app.put('/api/jobs/:id', Job.put);
app.post('/api/jobs', Job.post);
app.del('/api/jobs/:id', Job.del);
app.post('/api/jobs/:id/apply', Job.applyJob);
app.get('/api/jobs/:id/applicants', Job.getApplicants);

// API routes for candidate
app.get('/api/candidates', Candidate.get);
app.get('/api/candidates/:id', Candidate.getById);
app.put('/api/candidates/:id', Candidate.put);
app.post('/api/candidates', Candidate.post);
app.del('/api/candidates/:id', Candidate.del);

// API routes for recruiter
app.get('/api/recruiters', Recruiter.get);
app.get('/api/recruiters/:id', Recruiter.getById);
app.put('/api/recruiters/:id', Recruiter.put);
app.post('/api/recruiters', Recruiter.post);
app.del('/api/recruiters/:id', Recruiter.del);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
