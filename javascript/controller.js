app.controller("weatherapp_controller",function($scope,$http){
    
    // Defining unit imperial = Fahrenheit And metric = Celsius
    $scope.units = "imperial";
    
    /*
        Loading data
    */
    var url = "http://localhost:8080/city";
    $http.get(url).then(function(response){
        $scope.cities = response.data;
    },function(error){
        
    });
    
    /*
        Getting data set from openweather API according to city and units
    */
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
    /*
        Posting the data set
    */
    $scope.postData = function()
    {
        var weather = {};
        weather.city = {};
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
        var url = "http://localhost:8080/weather/create";
        $http.post(url,weather).then(function(response){
            console.log(response.data);
        },function(error){
            
        });
    }
    
});