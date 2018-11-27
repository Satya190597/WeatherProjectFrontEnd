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
    
});