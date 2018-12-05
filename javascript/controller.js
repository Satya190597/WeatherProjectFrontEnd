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
            if(response.data.id == null)
                alert("You Have Already Added Todays Data ...");
        },function(error){
            
        });
    }
    
});
app.controller("weatherapp-all-report",function($scope,$http){
    $scope.weather = {};
    $http.get("http://localhost:8080/weather/").then(function(response){
        $scope.weathers = response.data;
        console.log($scope.weathers);
    },function(data){
        
    })
});
app.controller("weatherapp_report_controller",function($scope,$http){
    $scope.weathers = {};
    $http.get("http://localhost:8080/weather/").then(function(response){
        $scope.weathers = response.data;
        
        console.log($scope.weathers);
    },function(data){
        
    })
    $scope.temp = [];
    $scope.getData = function(){
        angular.forEach($scope.weathers,function(value){
            console.log(value);
            $scope.temp.push(value.temp);
        });
        console.log($scope.temp);
    }
});
app.controller("weatherapp_chart_controller",function($scope,$http,chart_service){
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
    var weathers = chart_service.getWeatherById(1);
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