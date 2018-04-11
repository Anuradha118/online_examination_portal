myApp.controller('testStatistics',['$location','$rootScope','$window','$filter','TestService','TestInformation',function($location,$rootScope,$window,$filter,TestService,TestInformation){
    var main=this;

    var testData=[];
    this.info=[];
    main.searchText='';
    main.currentPage=0;
    main.pageSize=5;

    this.getData = function () {
        return $filter('filter')(main.info, main.searchText);
    };
      
    this. numberOfPages=function(){
    return Math.ceil(main.getData().length/main.pageSize);                
    };

    //function to get all the test details
    const testDetails=()=>{
        if(main.testData){
            TestService.getExamineesofTest(main.testData.testId)
                .then(function success(response){
                    main.info=response.data.data;
                    calculateScoreStatistics();
                },function error(response){
                    console.log(response);
                    alert('Some error occurred');
                }
            )
        }
    };

    //function get single test
    this.getTestData=function(){
        main.testData=TestInformation.getData();
        // console.log(main.testData);
        testDetails();
    }; 

    main.getTestData();

    //function to calculate all test score, etc..
    let calculateScoreStatistics=function(){
        var sum=0;
        main.count=main.info.length;
        var max=0;
        var min=0;
        for(var i=0;i<main.info.length;i++){
            if(min>main.info[i].score){
                min=main.info[i].score;
            }
            if(max<main.info[i].score){
                max=main.info[i].score;
            }
            sum=sum+parseInt(main.info[i].score);
        }
        if(main.count==0){
            main.avg=0;
        }else{
            main.avg=(sum/main.count).toFixed(2);
        }
        main.high=max;
        main.low=min;
    }; 

    // function to get all registered users
    this.allUsers=function(){
        main.allUsers=TestInformation.getAllUsers();
    };

    main.allUsers();

    //function to get an examinee details
    main.getExamineeDetails=function(email){
        TestService.getExamineeTests(email)
            .then(function success(response){
                main.examineeTests=response.data.data;
                main.userMetrics();
            },function success(response){
                console.log(response);
                alert('Some error occurred');
            }
        );
    }; 

    //function to calculate examinee performance
    this.userMetrics=()=>{
        main.noOfTests=main.examineeTests.length;
        main.username=main.examineeTests[0].username;
        if(main.noOfTests>0){
            var sum=0;
            var temp,maxTemp,minTemp=0;
            var max=0;
            var min=(parseInt(main.examineeTests[0].score)/parseInt(main.examineeTests[0].totalQuestions))*100;
            for(var i=0;i<main.examineeTests.length;i++){
                temp=(parseInt(main.examineeTests[i].score)/parseInt(main.examineeTests[i].totalQuestions))*100;
                if(temp<min){
                    minTemp=i;
                    min=temp;
                }
                if(temp>max){
                    maxTemp=i;
                    max=temp;
                }

                sum+=temp;
            }
            main.avg=(sum/main.noOfTests).toFixed(2);
            $rootScope.Percent=main.avg;

            main.max=main.examineeTests[maxTemp].score + ' out of ' + main.examineeTests[maxTemp].totalQuestions;
            main.min=main.examineeTests[minTemp].score + ' out of ' + main.examineeTests[minTemp].totalQuestions;

            var data={
                username:main.username,
                noOfTests:main.noOfTests,
                max:main.max,
                min:main.min,
                avg:main.avg
            };

            TestInformation.setUserStats(data);
            $location.path('/userStats');
        }else{
            alert('User has not attempted any Tests yet !!');
        }
    }; 

    this.getUserStats=function(){
        main.userStats=TestInformation.getUserStats();
    }

    main.getUserStats();

    this.goBack=function(){
        $window.history.back();
    }
}]);

myApp.filter('pageFilter', function() {
    return function(input, start) {
    start = +start; //parse to int
    return input.slice(start);
   }
});