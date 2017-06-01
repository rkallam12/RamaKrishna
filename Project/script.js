var storage = JSON.parse(localStorage.myData);

var app = angular.module('myApp', ['ngRoute']);

app.config(function($routeProvider){
	$routeProvider.when('/',{
		templateUrl:'login.html',
		controller: 'loginCtrl'
	})
	.when('/home',{
		templateUrl:'home.html',
		controller: 'homeCtrl',
		resolve:{
			app: function($location){
				if(localStorage.idx == -1){
					$location.path('/')
				}
			}
		}
	})
	
	.when('/profile',{
		templateUrl:'profile.html',
		controller: 'profileCtrl',
		resolve:{
			app: function($location){
				if(localStorage.idx == -1){
					$location.path('/')
				}
			}
		}
	})
	.when('/messages',{
		templateUrl:'messages.html',
		controller: 'messagesCtrl',
		resolve:{
			app: function($location){
				if(localStorage.idx == -1){
					$location.path('/')
				}
			}
		}
	})
	.when('/messages/:i',{
		templateUrl:'messagedetails.html',
		controller:'msgDetailsCtrl',
		resolve:{
			app: function($location){
				if(localStorage.idx == -1){
					$location.path('/')
				}
			}
		}
	})
	.when('/signup',{
		templateUrl:'signup.html',
		controller:'signupCtrl'
	})
})

app.factory('login', function(){
	var obj = {};
	obj.validation = function(a,b){
		for(x in storage){
		if(storage[x].username===a && storage[x].password===b){
			localStorage.idx = x;
			return true;
			break;
		}
	}
		return false;
	
	}
	return obj;
})

app.factory('sendMessage', function(){
	var obj = {};
	obj.message = function(a,b,c,d){
		for(x in storage){
			if(storage[x].username===a){
				var msg_obj = {
					"sender":storage[localStorage.idx].username,
					"subject":b,
					"content":c,
					"checked":d
				};
				storage[x].messages.push(msg_obj);
				localStorage.myData = JSON.stringify(storage);
			}
		}
	}
	return obj;
})

app.factory('deleteMessage', function(){
	var obj = {};
	obj.delete = function(a){
		storage[localStorage.idx].messages.splice(a,1);
		localStorage.myData = JSON.stringify(storage);
	}
	return obj;
})

app.factory('important', function(){
	var obj = {};
	obj.imp = function(i){
		storage[localStorage.idx].messages[i].checked = !(storage[localStorage.idx].messages[i].checked);
		localStorage.myData = JSON.stringify(storage);
	}
	return obj;
})

app.factory('mylogout', function($location){
	var obj = {};
	obj.logout = function(){
		$location.path('/');
	    localStorage.idx = -1;

	}
	return obj;
})

app.factory('myProfile',function(){
	var obj = {};
	obj.profile = function(a,b,c,d,e,f){
		console.log(a)
		document.getElementById('promsg').innerHTML = '';
		if(a==""||b==""||c==""||d==""||e==""||f==""){
			document.getElementById('promsg').innerHTML = '*Please fill all fields';
		}
		else{
			var arr = [];
			for(x in storage){
				arr.push(storage[x].username)
			}
			arr.splice(arr.indexOf(storage[localStorage.idx].username),1);
			if(arr.indexOf(b)==-1){
				storage[localStorage.idx].name = a;
				storage[localStorage.idx].username = b;
				storage[localStorage.idx].password = c;
				storage[localStorage.idx].location = d;
				storage[localStorage.idx].email = e;
				storage[localStorage.idx].phone = f;
				localStorage.myData = JSON.stringify(storage);
				document.getElementById('promsg').innerHTML = '*Values are updated';
			}
			else{
				document.getElementById('promsg').innerHTML = '*The username already exists';
			}
		}
	}
	return obj;
})

app.factory('mySignup', function(){
	var obj = {};
	obj.signup = function(a,b,c,d,e,f){
		console.log(a);
		document.getElementById('promsg').innerHTML = '';
		if(a==""||b==""||c==""||d==""||e==""||f==""){
			document.getElementById('promsg').innerHTML = '*Please fill all fields';
		}
		else{
			var arr = [];
			for(x in storage){
				arr.push(storage[x].username)
			}
			if(arr.indexOf(b)==-1){
				localStorage.idx = arr.length;
				var user_obj = {
					"name":a,
					"username":b,
					"password":c,
					"location":d,
					"email":e,
					"phone":f,
					"messages":[]
				};
				storage.push(user_obj);
				localStorage.myData = JSON.stringify(storage);
			}
			else{
				document.getElementById('promsg').innerHTML = '*The username already exists';
			}
		}
	}
	return obj;
})

app.controller('loginCtrl', ['$scope', '$rootScope', 'login', '$location', function($scope, $rootScope, login, $location){
	$scope.authenticate = function(){
		$rootScope.valid = login.validation($scope.username, $scope.password);
		if($rootScope.valid){
			
			$location.path('/home');

		}
		else{
			$scope.error = 'invalid username or password';
		}
	}
	$scope.signup = function(){
		$location.path('/signup');
	}
}])

app.controller('homeCtrl', ['$scope', '$rootScope', 'mylogout', function($scope,$rootScope, mylogout){
	$rootScope.user = storage[localStorage.idx].name;
	$rootScope.logout = function(){
		mylogout.logout();
	}
}])

app.controller('profileCtrl', ['$scope', '$rootScope', 'mylogout', 'login', 'myProfile', function($scope, $rootScope, mylogout, login, myProfile){
	$rootScope.user = storage[localStorage.idx].name;
	$scope.name = storage[localStorage.idx].name;
	$scope.username = storage[localStorage.idx].username;
	$scope.password = storage[localStorage.idx].password;
	$scope.email = storage[localStorage.idx].email;
	$scope.location = storage[localStorage.idx].location;
	$scope.phone = storage[localStorage.idx].phone;
	$scope.changeDetails = function(a,b,c,d,e,f){
		myProfile.profile(a,b,c,d,e,f);
	}
	$rootScope.logout = function(){
		mylogout.logout();
	}
}])

app.controller('messagesCtrl',['$scope', '$rootScope', '$location', 'sendMessage', 'deleteMessage', 'important', 'mylogout', function($scope, $rootScope, $location, sendMessage, deleteMessage, important, mylogout){
	$rootScope.user = storage[localStorage.idx].name;
	$scope.msg = storage[localStorage.idx].messages;
	$scope.sendMessage = function(){
		sendMessage.message($scope.receipient,$scope.subject,$scope.content,$scope.check);
		$scope.receipient="";
		$scope.subject="";
		$scope.content="";
		$scope.check=false;
	}
	$scope.delete = function(k){
		deleteMessage.delete(k);
	}
	$scope.view = function(i){
		$rootScope.index = i;
		$location.path('/messages/:i');
	}
	$scope.important = function(i){
		important.imp(i);
	}
	$rootScope.logout = function(){
		mylogout.logout();
	}
}])

app.controller('msgDetailsCtrl', ['$scope', '$rootScope', '$routeParams', 'mylogout', function($scope, $rootScope, $routeParams, mylogout){
	$scope.content = storage[localStorage.idx].messages[$rootScope.index].content;
	$rootScope.user = storage[localStorage.idx].name;
	$rootScope.logout = function(){
		mylogout.logout();
	}
}])

app.controller('signupCtrl', ['$scope', '$location', 'mySignup', function($scope, $location, mySignup){
	$scope.sname = "";
	$scope.susername = "";
	$scope.spassword = "";
	$scope.semail = "";
	$scope.slocation = "";
	$scope.sphone = "";
	$scope.signup = function(){
		console.log($scope.sname)
		mySignup.signup($scope.sname,$scope.susername,$scope.spassword,$scope.slocation,$scope.semail,$scope.sphone);
		if(localStorage.idx>-1){
			$location.path('/home');
		}
	}
	$scope.goback = function(){
		$location.path('/');
	}
}])