var app = angular.module('Recruiting', ['ngRoute', 'facebook']);


app.config(['$routeProvider', 'FacebookProvider', function($routeProvider, FacebookProvider) {

  $routeProvider
    .when('/', {
      templateUrl: 'partials/home.html',
      controller: ''
    })
    .when('/jobs', {
      templateUrl: '/partials/jobs.html',
      controller: 'JobCtrl'
    })
    .when('/recruiters', {
      templateUrl: '/partials/recruiters.html',
      controller: 'RecruiterCtrl'
    })
    .when('/candidates', {
      templateUrl: '/partials/candidates.html',
      controller: 'CandidateCtrl'
    })

  FacebookProvider.init('711945518932593');
  
}]);

app.controller('MainCtrl', function($scope, Facebook) {
  
  $scope.loggedIn = false;
  
  $scope.login = function() {
    Facebook.login(function(res) {
      $scope.loggedIn = true;
      
      Facebook.api('/me', function(res) {
        $scope.user = res;
      });
      
      Facebook.api('/me?fields=likes', function(res) {
        $scope.interests = [];
        var data = res.likes.data;
        
        for(var i =0; i < data.length; i++) {
          if( $scope.interests.indexOf(data[i].category) == -1 ) {
            $scope.interests.push(data[i].category);
          }
        }
        
        $scope.interests = $scope.interests.join(' ').split('/').join(' ').split(' ');     
        
        console.log($scope.interests);
      });
      
    }, {scope: 'email,user_likes'});
  };
  
  $scope.logout = function() {
    Facebook.logout(function(res) {
      console.log(res);
      $scope.loggedIn = false;
    })
  }
  
});


app.controller('JobCtrl', function($scope, $http){
  $scope.job = {};
  
  $scope.candidate = {};
  
  $scope.applyJob = function(e) {
    console.log($scope.candidate);
    $(".close").click();
    
    var url = '/api/jobs/' + $scope.currentJob + '/apply'
    
    $http.post(url, $scope.candidate)
      .success(function(res) {})
      .error(function(err) {});
  };
  
  $scope.setCurrentJob = function(id) {
    $scope.currentJob = id;
  };

  $http.get('/api/jobs').success(function(res){
    $scope.jobs = res;
    console.log($scope.jobs);
  });

  $scope.createJob = function(e) {
    $http.post('/api/jobs', $scope.job)
      .success(function(res, status) {
        $scope.jobs.push(res);
        $(".close").click();
      })
      .error(function(res, status) {});
  };
});

app.controller('RecruiterCtrl', function($scope, $http){
  $scope.recruiter = {};

  $http.get('/api/recruiters').success(function(res){
    $scope.recruiters = res;
    console.log($scope.recruiters);
  });

  $scope.createRecruiter = function(e) {
    $http.post('/api/recruiters', $scope.recruiter)
      .success(function(res, status) {
        $scope.recruiters.push(res);
        $(".close").click();
      })
      .error(function(res, status) {});
  };
});

app.controller('CandidateCtrl', function($scope, $http){
  $scope.candidate = {};
  
  $http.get('/api/candidates').success(function(res){
    $scope.candidates = res;
    console.log($scope.candidates);
  });

  $scope.createCandidate = function(e) {
    $scope.candidate.interests = $scope.$parent.interests;
    console.log($scope.candidate);
    
    $http.post('/api/candidates', $scope.candidate)
      .success(function(res, status) {
        $scope.candidates.push(res);
        $(".close").click();
      })
      .error(function(res, status) {});
  };
});
