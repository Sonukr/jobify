var mongoose = require('mongoose');

var jobSchema = mongoose.Schema({
  company     : String,        //name
  location    : String,       //location
  date        : Date,        //date
  designation : String,     //mail
  summary     : String,    // summary
  applicants  : []
});

var Job = mongoose.model('job', jobSchema);

var getJobs = function(req, res) {
  Job.find({}, function(err, docs){
    if(!err) res.send(200, docs);
    else res.send(500, { error: "Internal Server Error while fetching jobs"});
  });
};

var getJobById = function(req, res) {
  Job.findById(req.params.id, function(err, doc){
    if(!err) res.send(200, doc);
    else res.send(500, { error: "Internal Server Error while fetching job by id"});
  });
};

var postJob = function(req, res) {
  var job = new Job(req.body);

  job.save(function(err) {
    if(!err) res.send(201, job);
    else res.send(500, { error: "Internal Server Error while creating a new job"});
  });
};

var updateJob = function(req, res) {
  Job.findOneAndUpdate({ _id: req.params.id }, req.body, function(err, doc) {
    if(!err) res.send(200);
    else res.send(500, { error: "Internal Server Error while updating job"});
  });
};

var deleteJob = function(req, res) {
  Job.findByIdAndRemove(req.params.id, function(err, doc) {
    if(!err) res.send(200);
    else res.send(500, { error: "Internal Server Error while deleting job"});
  });
};

var applyJob = function(req, res) {
  Job.findByIdAndUpdate( 
    req.params.id,
    {$push: {applicants: req.body}},
    {safe: true, upsert: true},
    function(err, model) {
      if(!err) res.send(200);
      else res.send('500', { error: "Internal Server Error while applying for job"});
    });
};

var getApplicants = function(req, res) {
  Job.findById(req.params.id, { applicants: 1 }, function(err, docs) {
    if(!err) res.send(200, docs.applicants);
    else res.send('500', { error: "Internal Server Error while fetching job applicants"});
  });
};

module.exports = {
  get: getJobs,
  getById: getJobById,
  post: postJob,
  put: updateJob,
  del: deleteJob,
  applyJob: applyJob,
  getApplicants: getApplicants
};
