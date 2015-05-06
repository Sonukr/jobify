var mongoose = require('mongoose');

var recruiterSchema = mongoose.Schema({
  name: String,
  company: String,
  contact: String,
  email: String
});

var Recruiter = mongoose.model('recruiter', recruiterSchema);

var getRecruiters = function(req, res) {
  Recruiter.find({}, function(err, docs){
    if(!err) res.send(200, docs);
    else res.send(500, { error: "Internal Server Error while fetching recruiters"});
  })
};

var getRecruiterById = function(req, res) {
  Recruiter.findById(req.params.id, function(err, doc){
    if(!err) res.send(200, doc);
    else res.send(500, { error: "Internal Server Error while fetching recruiter by id"});
  });
};

var postRecruiter = function(req, res) {
  var recruiter = new Recruiter(req.body);

  recruiter.save(function(err) {
    if(!err) res.send(201, recruiter);
    else res.send(500, { error: "Internal Server Error while creating a new recruiter"});
  });
};

var updateRecruiter = function(req, res) {
  Recruiter.findOneAndUpdate({ _id: req.params.id }, req.body, function(err, doc) {
    if(!err) res.send(200);
    else res.send(500, { error: "Internal Server Error while updating recruiter"});
  });
};

var deleteRecruiter = function(req, res) {
  Recruiter.findByIdAndRemove(req.params.id, function(err, doc) {
    if(!err) res.send(200);
    else res.send(500, { error: "Internal Server Error while deleting recruiter"});
  });
};

module.exports = {
  get: getRecruiters,
  getById: getRecruiterById,
  post: postRecruiter,
  put: updateRecruiter,
  del: deleteRecruiter
};
