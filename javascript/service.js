app.service('chart_service',function($http){
    this.getWeatherById = function(id){
        return $http.get("http://localhost:8080/weather/"+id).then(function(response){
            return response.data;
        },function(response){
            alert("Please check your internet connection ...");
            return {};
        });
    }
});