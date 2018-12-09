app.config(function($stateProvider) {
    var helloState = {
    name: 'login',
    url: '/login',
    templateUrl: 'login.html',
    controller: 'login_controller'
    }

    var aboutState = {
    name: 'login_data',
    url: '/login_data',
    templateUrl: 'get_data.html'
    }

    $stateProvider.state(helloState);
    $stateProvider.state(aboutState);
});