myApp.controller('userController',['$location','$rootScope','UserService',function($location,$rootScope,UserService){

    var main=this;
    $rootScope.isLoggedIn=false;
    $rootScope.isAdmin=false;
    $rootScope.isUser=false;

    // function called on signup
    this.signup=function(){
        var newUser={
            firstname:main.firstname,
            lastname:main.lastname,
            email:main.email,
            mobile:main.mobile,
            password:main.password
        };

        UserService.signUp(newUser)
            .then(function success(response){
                main.error=response.data.error;
                main.message=response.data.message;
            },function error(response){
                console.log(response);
                // alert('Some error occurred!!');
            }
        );

        main.firstname='';
        main.lastname='';
        main.email='';
        main.mobile='';
        main.password='';

    };

    //function called on signin
    this.signin=function(){
        var user={
            email:main.email,
            password:main.password
        };

        UserService.signIn(user)
            .then(function success(response){
                main.message=response.data.message;
                if(response.data.error){
                    console.log("Error");
                }else{
                    UserService.setData(response.data.data);
                    main.closeButton=response.data.error;
                    $rootScope.isLoggedIn=true;
                    if(main.checkAdmin(user.email)){
                        $rootScope.isAdmin=true;
                        $location.path('/admindashboard');
                    }else{
                        $rootScope.isUser=true;
                        $location.path('/userdashboard');
                    }
                }
            },function error(response){
                console.log(response);
                // alert('Some error occurred!!');
            });
            main.email='';
            main.password='';
    };

    //function called on forgot password
    this.forgotPassword=function(){
        var data={
            email:main.email
        }

        UserService.forgotPassword(data)
            .then(function success(response){
                main.email='';
            },function error(response){
                alert('Some Error Occurred!!');
            }
        );
    };

    //function called to verify otp
    this.verifyOtp=function(){
        var otp=main.otp;

        UserService.verifyOtp(otp)
            .then(function success(response){
                main.check=response.data.error;
                main.message=response.data.message;
                main.otp='';
            },function error(response){
                alert('Some Error Occurred!!');
            }
        );
    };

    //function called to rest password
    this.resetPassword=function(){
        if(main.newPassword!=main.confirmPassword){
            alert("Password didn't match!!");
            main.newPassword='';
            main.confirmPassword='';
        }else{
            var data={
                password:main.newPassword
            }

            UserService.resetPassword(data)
                .then(function success(response){
                    main.message=response.data.message;
                    main.resetButton=response.data.error;
                    main.newPassword='';
                    main.confirmPassword='';
                },function error(response){
                    alert('Some Error Occurred!!');
                }
            );
        }
    };

    //function called after when signin with google or facebook
    this.passportLogin=function(){
        UserService.passportLogin()
            .then(function success(response){
                if(response.data.data != undefined || response.data.data != null){
                    UserService.setData(response.data.data);
                    var userInfo=response.data.data.user;
                    if(userInfo){
                        if(main.checkAdmin(userInfo)){
                            $rootScope.isAdmin=true;
                            $location.path('/admindashboard');
                        }else{
                            $rootScope.isUser=true;
                            $location.path('/userdashboard');
                        }
                    }
                }

            }, function errorCallback(response) {
                console.log(response);
                // alert('Some error occurred');
            });
    };

    main.passportLogin();

    //function called when user logout
    this.logout=function(){
        alert('You are now logged out!');
        localStorage.removeItem('user');
        localStorage.removeItem('x-auth');
        $rootScope.isLoggedIn = false;
        $rootScope.isAdmin = false;
        $rootScope.isUser = false;
        UserService.logout()
            .then((response)=>{
                $location.path('/');
            },(error)=>{
                console.log(error);
                alert('Some error occurred');
            }
        );
    };

    //function to check whether signedin user is admin or not
    this.checkAdmin=function(email){
        if(email==='admin@edacademy.com'){
            return true;
        }else{
            return false;
        }
    }
}])