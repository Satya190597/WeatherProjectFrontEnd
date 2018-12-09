/*
*   ---------------------------------------------------------------------------------------------------------------
*   LOGIN CONTROLLER
*   1. Set rootscope 2. Navigate to dashboard 3 Used HTTP header for authentication
*/
app.controller('login_controller',function($scope,$http,$state,$rootScope,$window){
    $scope.login = function(){
        var headers = {headers:{ 'Authorization':  'Basic ' + btoa($scope.email + ':' + $scope.password)}};
        console.log(headers+" "+$scope.email+" "+$scope.password);
        $http.get("http://localhost:8080/current_user",headers).then(function(response){
            if(response.data.email == $scope.email && response.data.password == $scope.password)
            {
                $window.localStorage.setItem("user_email",response.data.email);
                $window.localStorage.setItem("user_password",response.data.password);
                $window.localStorage.setItem("user_id",response.data.id);
                $rootScope.user_id = response.data.id;$state.go('login_data');
            }
            else
            {
                alert('Invalid Userid And Password');
            }
        },function(error){
            if(error.status == -1)
                alert('Invalid Userid And Password');
        });
    }
});
/*
*   ---------------------------------------------------------------------------------------------------------------
*   LOGOUT CONTROLLER
*   1. Logout current user  2. Check validity of current user
*/
app.controller("logout_controller",function($scope,$state,$window){
    $scope.logout = function(){
        $window.localStorage.removeItem("user_email");
        $window.localStorage.removeItem("user_password");
        $scope.validity();
    }
    $scope.validity = function()
    {
        if($window.localStorage.getItem("user_email") == undefined || $window.localStorage.getItem("user_password") == undefined)
            $state.go('login');
    }
    $scope.validity();
})
/*
*   ---------------------------------------------------------------------------------------------------------------
*   WEATHER APP CONTROLLER
*/
app.controller("weatherapp_controller",function($scope,$http,$rootScope,$state,$window){
    // Defining unit imperial = Fahrenheit And metric = Celsius
    $scope.units = "imperial";
    // Getting list of cities
    var headers = {headers:{ 'Authorization':  'Basic ' + btoa($window.localStorage.getItem("user_email") + ':' + $window.localStorage.getItem("user_password"))}};
    var url = "http://localhost:8080/city";
    $http.get(url,headers).then(function(response){
        $scope.cities = response.data;
    },function(error){
        
    });
    //  Getting data set from openweather API according to city and units
    $scope.getDataSet = function()
    {
        console.log($scope.city);
        var city = JSON.parse($scope.city);
        var url = 'http://api.openweathermap.org/data/2.5/weather?q='+city.name+',IN&APPID=836159853acb3fb0769e54bea3f5401f&units='+$scope.units;
        $http.get(url).then(function(response){
            $scope.weather = response.data;
        },function(error){
            
        });
    }
    //  Posting the data set
    $scope.postData = function()
    {
        var weather = {};
        weather.city = {};
        weather.user = {};
        weather.humidity = $scope.weather.main.humidity;
        weather.pressure = $scope.weather.main.pressure;
        weather.temp = $scope.weather.main.temp;
        weather.temp_max = $scope.weather.main.temp_max;
        weather.temp_min = $scope.weather.main.temp_min;
        weather.speed = $scope.weather.wind.speed;
        weather.city.id = JSON.parse($scope.city).id;
        weather.country = $scope.weather.sys.country;
        weather.icon = $scope.weather.weather[0].icon;
        weather.description = $scope.weather.weather[0].description;
        weather.unit = $scope.units;
        weather.user.id = $scope.user_id;
        var url = "http://localhost:8080/weather/create";
        $http.post(url,weather).then(function(response){
            if(response.data.id == null)
            {
                alert("You Have Already Added Todays Data ...");
            }
            else
            {
                alert("Data Added Successfully");
            }
        },function(error){
            
        });
    }
    
});
app.controller("weatherapp-all-report",function($scope,$http,$rootScope,$window){
    $scope.weather = {};
    $scope.getRepositoryRecords = function(){
        var headers = {headers:{ 'Authorization':  'Basic ' + btoa($window.localStorage.getItem("user_email") + ':' + $window.localStorage.getItem("user_password"))}};
        $http.get("http://localhost:8080/weather/",headers).then(function(response){
            $scope.weathers = response.data;
            console.log($scope.weathers);
        },function(data){

        })
    }
    $scope.deleteRecord = function(id){
        console.log(id);
        var headers = {headers:{ 'Authorization':  'Basic ' + btoa($window.localStorage.getItem("user_email") + ':' + $window.localStorage.getItem("user_password"))}};
        $http.delete("http://localhost:8080/weather/"+id,headers).then(function(response){
            $scope.getRepositoryRecords();
        },function(data){

        })
    }
    $scope.getRepositoryRecords();
});
/*
----------------------- WEATHER REPORT CONTROLLER --------------------------------
*/
app.controller("weatherapp_report_controller",function($scope,$http,$rootScope,$window){
    console.log("Login Flag : "+$scope.flag);
    $scope.weathers = {};
    $scope.getRepositoryRecords = function(){
        var headers = {headers:{ 'Authorization':  'Basic ' + btoa($window.localStorage.getItem("user_email") + ':' + $window.localStorage.getItem("user_password"))}};
        $http.get("http://localhost:8080/weather/",headers).then(function(response){
            $scope.weathers = response.data;
        },function(data){

        })
    }
    $scope.getRepositoryRecords();
});
/*
-------------------------------- CHART CONTROLLER --------------------------------
*/
app.controller("weatherapp_chart_controller",function($scope,$http,chart_service,$window){
    $scope.headers = {headers:{ 'Authorization':  'Basic ' + btoa($window.localStorage.getItem("user_email") + ':' + $window.localStorage.getItem("user_password"))}};
    $scope.weathers = {};
    $scope.wind_speed = [];
    $scope.humidity = [];
    $scope.temp_max_min_data = [];
    $scope.temp_max = [];
    $scope.temp_min = [];
    $scope.temp = [];
    $scope.label = [];
    $scope.series = ['Temp'];
    $scope.temp_max_min_series = ['Max Temperature','Min Temperature'];
    $scope.series_humidity = ['Humidity'];
    $scope.series_wind = ['Wind'];
    var weathers = chart_service.getWeatherById(1,$window.localStorage.getItem("user_email"),$window.localStorage.getItem("user_password"));
    weathers.then(function(data){
        console.log(data);
        angular.forEach(data,function(value){
            $scope.temp.push(value.temp);
            $scope.label.push(value.created_at);
            $scope.temp_max.push(value.temp_max);
            $scope.temp_min.push(value.temp_min);
            $scope.wind_speed.push(value.speed);
            $scope.humidity.push(value.pressure);
        });
    });
    $scope.temp_max_min_data.push($scope.temp_max);
    $scope.temp_max_min_data.push($scope.temp_min);
});