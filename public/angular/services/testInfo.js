myApp.service('TestInformation',function(){
    var main=this;

    //set single test data
    this.setData=function(data){
        main.testData=data;
    };

    // get single test data
    this.getData=function(){
        return main.testData;
    };

    //set user data
    this.setUserData=function(data){
        main.userData=data;
    };

    // get user data
    this.getUserData=function(){
        return main.userData;
    };

    // set all users present in the system
    this.setAllUsers=function(data){
        main.allUsers=data;
    };

    //get all users present in the system
    this.getAllUsers=function(){
        return main.allUsers;
    }

    // set user statistics
    this.setUserStats=function(data){
        main.userStats=data;
    }

    //get user statistics
    this.getUserStats=function(data){
        return main.userStats;
    }
})