var app = app;

app.controller('adminLogoutController', function($location, Auth){
	Auth.logout();
	$location.path('/#/');
});