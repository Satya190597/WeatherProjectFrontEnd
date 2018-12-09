app.service('chart_service',function($http){
    this.getWeatherById = function(id,email,password){
        return $http.get("http://localhost:8080/weather/"+id,{
            headers:{ 'Authorization':  'Basic ' + btoa(email + ':' + password)}
            }).then(function(response){
            return response.data;
        },function(response){
            alert("Please check your internet connection ...");
            return {};
        });
    }
});