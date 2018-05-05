myApp.service('UserService',function($http,$localStorage,jwtHelper){

    var main=this;
    // var store=$window.localStorage;
    var authToken='';
    var user='';

    this.signUp=function(user){
        return $http.post('/signup',user);
    }; //end sign up

    this.signIn=function(user){
        return $http.post('/signin',user);
    }; // end sign in

    this.forgotPassword = function (data) {

        return $http.post('/forgot-password', data);

    }; //end forgot password email intake

    this.verifyOtp = function (data) {

        return $http.get('/verify-otp', {
            params: {
                otp: data
            }
        });
    }; //end verifying otp

    this.resetPassword = function (data) {

        return $http.post('/reset-password', data);
    };

    this.setData=function(data){
        if(data){
            main.authToken=data.token;
            main.user=data.user.email;
            $localStorage.user=data.user.email;
            $localStorage.accessToken=data.token;
        }
    }; // end of set-token

    this.getData=function(){
         var data={
            user:$localStorage.user,
            token:$localStorage.accessToken
         };
         return data;
    }; // end of get-token

    this.passportLogin = function () {

        return $http.get('/userDetails');

    }; //end getting passport login details

    this.isAuthenticated=function(){
        var token=$localStorage.accessToken;
        return (token===main.authToken || jwtHelper.isTokenExpired(token));
    }; // check if user is authenticated or not

    this.logout=function(){
        return $http.get('/logout');
    }; //end of logout
})