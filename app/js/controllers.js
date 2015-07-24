gresumeApp.controller('IndexController', ['$scope', '$state', function($scope, $state) {}])

gresumeApp.controller('HomeController', ['$scope', '$state', function($scope, $state) {
  document.title = 'gresume - home'; //set the page title

  $scope.jobsData = [];

  $.getJSON('../api/home')
    .success(function(data) {

      //console.log(data);
      $scope.jobsData = data;
      console.log($scope.jobsData);

      $scope.$apply();

    });

  $( '#popover' ).hide();
  $scope.makeShift = function(jobtitle, joblocation){
    $( '#popover' ).hide();
    $( '#popover' ).fadeIn();

    var job = jobtitle;
    var location = joblocation;

    $.getJSON('../api/selection/' + job + '/' + location )
      .success(function(data) {

        console.log(data.results);
        $scope.leads = data.results;
        $scope.$apply();
      })
      .error(function(error) {
        console.log('error:');
        console.log(error);
      });

  };

  $('#jobButton').click(function() {

    var title = $('#jobTitle').val();
    var location = $('#jobLocation').val();
    var description = $('#jobDescription').val();
    var wages = $('#jobWages').val();

    $scope.jobsData.push({
      'title': title,
      'location': location,
      'description': description,
      'wages': wages
    });

    console.log($scope.jobs);
    $.post( '../api/home', {
      'title': title,
      'location': location,
      'description': description,
      'wages': wages
    } );

    $('#jobTitle').val('');
    $('#jobLocation').val('');
    $('#jobDescription').val('');
    $('#jobWages').val('');

  });

  $scope.addMoreJobs = function() {

    var job = $('#jobName').val();
    var location = $('#locationName').val();
    $.getJSON('../api/home/' + job + '/' + location + '/' + $scope.page++)
      .success(function(data) {

        console.log(data.results);
        $scope.jobsData = _.union($scope.jobsData, data.results);
        $scope.$apply();
      })
      .error(function(error) {
        console.log('error:');
        console.log(error);
      });
  };
}])
