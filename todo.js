angular.module('todo', ['ionic','todo.services'])

.controller('TodoCtrl', function($scope, $ionicModal, $ionicPopup, SQLService) {
  
	SQLService.setup();
		
	$scope.loadTask = function() {
		SQLService.all().then(function (results) {
			$scope.tasks = results;
		});	
	}

	$scope.loadTask(); 

  // Create and load the Modal
  $ionicModal.fromTemplateUrl('new-task.html', function(modal) {
    $scope.taskModal = modal;
  }, {
    scope: $scope,
    animation: 'slide-in-up'
  });

  // Open our new task modal
  $scope.newTask = function() {
    $scope.taskModal.show();
  };

  // Close the new task modal
  $scope.closeNewTask = function() {
    $scope.taskModal.hide();
  };
  

  // Called when the form is submitted
  $scope.createTask = function(task) {
	SQLService.set(task.title);
	$scope.loadTask();
    $scope.taskModal.hide();
    task.title = "";
  };
  
  $scope.onItemDelete = function(taskid) {
	$ionicPopup.confirm({
	  title: 'Confirm Delete',
	  content: 'Are you sure you want to delete this task?'
	}).then(function(res) {
	  if(res) {
		SQLService.del(taskid);
		$scope.loadTask();
	  } 
	});
  };
  
  $scope.onItemEdit = function(taskid) {
    $ionicPopup.prompt({
	  title: 'Update Task',
	  subTitle: 'Enter new task'
	}).then(function(res) {
		SQLService.edit(res, taskid);
		$scope.loadTask();
	});
  };
  
  $scope.moveItem = function(item, fromIndex, toIndex) {
    $scope.items.splice(fromIndex, 1);
    $scope.items.splice(toIndex, 0, item);
  };
  
});
