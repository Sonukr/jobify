var mongoose = require('mongoose');
var sentiment = require('sentiment');

function rnd(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var candidateSchema = mongoose.Schema({
  name: String,
  contact: String,
  skills: [],
  summary: String,
  score: Number,
  interests: []
});

var Candidate = mongoose.model('candidate', candidateSchema);

var getCandidates = function(req, res) {
  Candidate.find({}, function(err, docs){
    if(!err) res.send(200, docs);
    else res.send(500, { error: "Internal Server Error while fetching candidates"});
  })
};

var getCandidateById = function(req, res) {
  Candidate.findById(req.params.id, function(err, doc){
    if(!err) res.send(200, doc);
    else res.send(500, { error: "Internal Server Error while fetching candidate by id"});
  });
};

var postCandidate = function(req, res) {  
  var candidate = new Candidate(req.body);
  
  candidate.skills = req.body.skills.split(',');
  
  candidate.score = sentiment(candidate.interests.join(" "), {"Product" : rnd(3,5), "service" : rnd(3,5), "Website" : rnd(3,5), "Musician" : rnd(3,5), "band" : rnd(3,5), "Computers" : rnd(3,5), "internet" : rnd(3,5), "website" : rnd(3,5), "Health" : rnd(3,5), "medical" : rnd(3,5), "pharmaceuticals" : rnd(3,5), "Education" : rnd(3,5), "Media" : rnd(3,5), "news" : rnd(3,5), "publishing" : rnd(3,5), "Local" : rnd(3,5), "business" : rnd(3,5), "News" : rnd(3,5), "media" : rnd(3,5), "website" : rnd(3,5), "Artist" : rnd(3,5), "Author" : rnd(3,5), "Internet" : rnd(3,5), "software" : rnd(3,5), "Community" : rnd(3,5), "Interest" : rnd(3,5), "Computers" : rnd(3,5), "technology" : rnd(3,5)}).score * 10;

  candidate.save(function(err) {
    if(!err) res.send(201, candidate);
    else res.send(500, { error: "Internal Server Error while creating a new candidate"});
  });
};

var updateCandidate = function(req, res) {
  Candidate.findOneAndUpdate({ _id: req.params.id }, req.body, function(err, doc) {
    if(!err) res.send(200);
    else res.send(500, { error: "Internal Server Error while updating candidate"});
  });
};

var deleteCandidate = function(req, res) {
  Candidate.findByIdAndRemove(req.params.id, function(err, doc) {
    if(!err) res.send(200);
    else res.send(500, { error: "Internal Server Error while deleting candidate"});
  });
};

module.exports = {
  get: getCandidates,
  getById: getCandidateById,
  post: postCandidate,
  put: updateCandidate,
  del: deleteCandidate
};
