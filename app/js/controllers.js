gresumeApp.controller('IndexController', ['$scope', '$state', 'workplaces', function($scope, $state, workplaces) {

  var substringMatcher = function(strs) {
    return function findMatches(q, cb) {
      var matches, substringRegex;

      // an array that will be populated with substring matches
      matches = [];

      // regex used to determine if a string contains the substring `q`
      substrRegex = new RegExp(q, 'i');

      // iterate through the pool of strings and for any string that
      // contains the substring `q`, add it to the `matches` array
      $.each(strs, function(i, str) {
        if (substrRegex.test(str)) {
          matches.push(str);
        }
      });

      cb(matches);
    };
  };

  $('#jobName').typeahead({
    hint: true,
    highlight: true,
    minLength: 1
  },
  {
    source: substringMatcher(workplaces.workplaces)
  });

  $('#locationName').typeahead({
    hint: true,
    highlight: true,
    minLength: 1
  },
  {
    source: substringMatcher(workplaces.cities)
  });

  $('#searchButton').click(function(){

    var job = $('#jobName').val();
    var location = $('#locationName').val();

    console.log(job + ' ' + location);

    $.getJSON('../api/home/' + job + '/' + location)
      .success(function(data) {

        console.log(data.results);
        $scope.jobsData = data.results;

        $scope.$apply();

      })
      .error(function(error){
        console.log('error:');
        console.log(error);
      });

  });

}])

gresumeApp.controller('HomeController', ['$scope', '$state', function($scope, $state) {
  document.title = 'heroes - selection'; //set the page title

  $scope.page = 1;
  $scope.noShow = false;
  $scope.addMoreJobs = function(){

    var job = $('#jobName').val();
    var location = $('#locationName').val();
    $.getJSON('../api/selection/' + job + '/' + location + '/' + $scope.page++)
      .success(function(data) {

        console.log(data.results);
        $scope.jobsData = _.union($scope.jobsData, data.results);
        $scope.$apply();
        //setTimeout(function(){$('#gridDisplay').packery();},250);//HACK
      })
      .error(function(error){
        console.log('error:');
        console.log(error);
      });
  };
}])
