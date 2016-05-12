var app= angular.module('home', ['ngRoute']);

	// routes
	app.config(function($routeProvider) {
		$routeProvider
			// route for the home page
			.when('/', {
				templateUrl : 'partials/index.html',
				controller  : 'MainController'
			})

			// route for the home page
			.when('/index', {
				templateUrl : 'partials/index.html',
				controller  : 'MainController'
			})

			// route for the about page
			.when('/create', {
				templateUrl : 'partials/create.html',
				controller  : 'CreateController'
			})

			// route for the service page
			.when('/impressum', {
				templateUrl : 'partials/impressum.html',
				controller  : 'ImpressumController'
			})

			// route for the service page
			.when('/edit/:id', {
				templateUrl : 'partials/edite.html',
				controller  : 'EditController',
			});
	
	});

//setting up an service to share id data between controller
app.factory('MyServiceID', function() {
 var saveID = {}
 function set(data) {
   savedID = data;
 }
 function get() {
  return savedID;
 }

 return {
  set: set,
  get: get
 }

});

		// create the controller
app.controller('MainController', ['$scope','$http','$location','MyServiceID', function($scope, $http, $location,MyServiceID) {
  
//gets all saved articles
var refresh = function() {
    $http.get('/index').success(function(res){
        $scope.todoList = res;
        
    })
}
//load pagecontent from database
refresh();

//deletes selected Todo
$scope.removeTodo = function(id){
	$http.delete('/todo/'+ id).success(function(res) {
		
		refresh();
	})
}

//change the View to edit
$scope.changeView = function (id) {
		MyServiceID.set(id);
		$location.path('/edit/'+ id);
    }


}]);



//creates the CreateController
app.controller('CreateController', ['$scope','$http', function($scope, $http) {
//create the max value
var value = 0;

//create the milestonelist
$scope.milestoneList = []

//adds a milestone to a list
$scope.addToMilestoneList = function(){
	$scope.milestoneList.push({
			title: $scope.milestoneName,
			value: $scope.milestoneValue,
			checked: 'unchecked'
		});
	value = Number(value) + Number($scope.milestoneValue);
}

//deletes a milestone from List
$scope.deleteMilestone = function(index) {  
	$scope.milestoneList.splice(index, 1);
		
}

//deletes all placeholder
var clearFunction = function(){
		$scope.title = "";
		$scope.content = "";
		$scope.date = "";
		$scope.milestonelist = [];
		$scope.milestoneValue = "";
		$scope.milestoneName = "";

} 

//post method
$scope.addTodo = function(){
//creates the data
data = { 	title : $scope.title,
			content : $scope.content,
			date: $scope.date,
			milestone : $scope.milestoneList,
			maxValue : value
		 }
$http.post('/create',data).success(function(data, status){
		clearFunction();
	})


};

}]);


// create the controller
app.controller('EditController', ['$scope','$http', 'MyServiceID', function($scope, $http, MyServiceID) {
 data =  MyServiceID.get();
var progressValue = 0;
var maxValue = 0;
 
//gets the edit from a special todo
 $http.get('/edit/' + data).success(function(res){
        $scope.title = res.title;
		$scope.content = res.content;
		$scope.date = res.date;
		$scope.milestoneList = res.milestone;
		maxValue = res.maxValue;
		console.log(maxValue);
    });


//adds a milestone to list	
$scope.addToMilestoneList = function(){
	$scope.milestoneList.push({
			title: $scope.milestoneName,
			value: $scope.milestoneValue,
			checked: 'unchecked'
		});
	maxValue = Number(maxValue) + Number($scope.milestoneValue);

}

//deletes a milestone from list
$scope.deleteMilestone = function(index) {  
	$scope.milestoneList.splice(index, 1);
	
}

//checks and milestone and change the progress
$scope.checkMilestone = function(index) {
	$scope.milestoneList[index].checked = 'checked';
	progressValue = Number(progressValue) + Number($scope.milestoneList[index].value);
	
}

//unchecks and milestone and change the progress
$scope.uncheckMilestone = function(index) {
	$scope.milestoneList[index].checked = 'unchecked';
	progressValue = Number(progressValue) - Number($scope.milestoneList[index].value);
	
}

//deletes all placeholder
var clearFunction = function(){
		$scope.title = "";
		$scope.content = "";
		$scope.date = "";
		$scope.milestonelist = [];
		$scope.milestoneValue = "";
		$scope.milestoneName = "";

} 

//update a milestone
$scope.updateTodo = function() {
var id = MyServiceID.get();

data = { 	title : $scope.title,
			content : $scope.content,
			date: $scope.date,
			milestone : $scope.milestoneList,
			id : MyServiceID.get(),
			progress: (progressValue/maxValue)*100
		 }
	$http.put('/edit/'+id, data).success(function(res,req){
		
	})
}


}]);



// create the controller
app.controller('ImpressumController', ['$scope','$http', function($scope, $http) {

$scope.email = {
        text: 'me@example.com'
      };

var clearFunction = function(){
		$scope.text = "";
		$scope.subjectText = "";
		$scope.email = "";
} 

//send data
$scope.sendMail = function(){
//creates the data
data = { 	email : $scope.email.text,
			text : $scope.text,
			subject: $scope.subjectText
		 }
clearFunction();
$http.post('/impressum',data).success(function(data, status){
		
		
	})


};


}]);