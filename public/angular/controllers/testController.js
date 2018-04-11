myApp.controller('testController',['$location','$rootScope','$scope','$window','$route','$filter','TestService','TestInformation','UserService',function($location,$rootScope,$scope,$window,$route,$filter,TestService,TestInformation,UserService){
    var main=this;
    main.show=true;
    main.index=1;
    main.min=0;
    main.max=0;
    main.avg=0;
    main.searchText='';
    main.currentPage=0;
    main.pageSize=5;
    main.allTests=[];
    main.testData=[];

    // set data for bar graph
    $scope.labels=[];
    $scope.data=[];
    $scope.options={
        scales:{
            yAxes: [
                {
                    id: 'y-axis-1',
                    type: 'bar',
                    display: true,
                    ticks: {
                        beginAtZero: true,
                        max: 100,
                        steps: 5,
                        stepValue: 10
                    },
                    position: 'left'
                },
              ]
        }
    };

    this.i=1;

    this.getData = function () {
        return $filter('filter')(main.allTests, main.searchText)
    };
      
    this. numberOfPages=function(){
    return Math.ceil(main.getData().length/main.pageSize);                
    };

    // function to get all registered users
    main.getAllUsers=function(){
        TestService.getAllUsers()
            .then(function success(response){
                main.noOfUsers=response.data.data.length;
                TestInformation.setAllUsers(response.data.data);
                main.allUsers=response.data.data;
            },function error(response){
                console.log(response);
            }
        );
    }; 

    main.getAllUsers(); //load when the controller get instantiate

    // function to get all tests created in the system
    main.getAllTests=function(){
        TestService.getAllTests()
            .then(function success(response){
                main.allTests=response.data.data;
                main.userTakenTest();
            },function error(response){
                console.log(response);
                alert('Some error occurred');
            }
        );
    }; 

    main.getAllTests(); //load when the controller get instantiate

    //function to create new test in the system
    main.createTest=function(){
         var newTest={
             title:main.title,
             description:main.description,
             totalQuestions:main.noOfquestions,
             totalTime:main.totalTime,
             instructions:main.instructions
         };

         main.show=false;

         TestService.createTest(newTest)
            .then(function success(response){
                main.message=response.data.message;
                main.tid=response.data.data._id;
            },function error(respnse){
                console.log(response);
                alert('Some error occurred');
            });
        
        $window.scrollTo(0, 0);
    }; 

    //function to add multiple questions
    main.addQuestions=function(){
        if(main.i<main.noOfquestions){
            main.addQuestion(main.tid);
            main.i++;
        }else{
            main.addQuestion(main.tid);
            $location.path('/admindashboard');
        }
        main.index++;
    };

    // function to add single question
    main.addQuestion=function(tid){
        var newQuestion={
            question:main.question,
            A:main.A,
            B:main.B,
            C:main.C,
            D:main.D,
            answer:main.answer
        };

        TestService.addQuestion(tid,newQuestion)
            .then(function success(response){
                main.message=response.data.message;
                if(main.addQues){
                    main.updateTest(main.testData._id);
                }
            }, function errorCallback(response) {
                console.log(response);
                alert('Some error occurred');
            }
        );
        $window.scrollTo(0, 0);
        main.question = "";
        main.A = "";
        main.B = "";
        main.C = "";
        main.D = "";
        main.answer = "";
    }; 

    //function to update the test
    main.updateTest=function(tid){
        var updateTest={
            title:main.testData.title,
            description:main.testData.description,
            totalQuestions:main.testData.totalQuestions,
            totalTime:main.testData.totalTime,
            instructions:main.testData.instructions
        };

        TestService.updateTest(tid,updateTest)
            .then(function success(response){
                main.message=response.data.message;
                TestService.getTest(tid)
                    .then(function success(response){
                        var data=response.data.data;
                        main.singleTest(data);
                        $route.reload();
                    })
            },function error(response){
                console.log(response);
                alert('Some error occurred');
            }
        );
    }; 

    // function to update single question
    main.updateQuestion=function(qid,index){
        var updateQuestion={
            question:main.testData.questions[index].question,
            A:main.testData.questions[index].A,
            B:main.testData.questions[index].B,
            C:main.testData.questions[index].C,
            D:main.testData.questions[index].D,
            answer:main.testData.questions[index].answer
        };
        TestService.updateQuestion(qid,updateQuestion)
            .then(function success(response){
                alert(response.data.message);
            },function error(response){
                console.log(response);
                alert('Some error occurred');
            }
        );
    };

    //function to delte the test
    main.deleteTest=function(testid){
        TestService.deleteTest(testid)
            .then(function success(response){
                alert(response.data.message);
                $location.path('/admindashboard');
            },function error(response){
                console.log(response);
                alert('Some error occurred');
            }
        );
    }; 

    //function to delete question
    main.deleteQuestion=function(testid,qid){
        TestService.deleteQuestion(testid,qid)
            .then(function success(response){
                main.message=response.data.message;
                main.testData.totalQuestions-=1;
                alert(main.message);
                $window.scrollTo(0,0);
                main.updateTest(main.testData._id);
            },function error(response){
                console.log(response);
                alert('Some error occurred');
            }
        ); 
    }

    //function to set single test data
    main.singleTest=function(test){
        main.completeTest=test;
        TestInformation.setData(main.completeTest);
        main.getInfo();
    };

    //function to get single test data
    main.getInfo=function(){
        main.testData=TestInformation.getData();
    };

    main.getInfo();

    // function to show question form when add question button is clicked
    main.showQuestion=function(){
        main.testData.totalQuestions=main.testData.totalQuestions+1;
        main.addQues=true;
    };

    // function to get all tests taken by examinee
    main.userTakenTest=function(){
        var token=UserService.getData().token;
        var data={
            token:token
        };

        TestService.getExamineeTakenTests(data)
            .then(function success(response){
                main.testsTaken=response.data.data;
                main.filterAvailableTest();
                main.userMetrics();
            },function error(response){
                console.log(response);
                alert('Some error occurred');
            }
        );
    };

    //function to filterout all the available test
    main.filterAvailableTest=function(){
        var attemptedTest=[];
        var testAvailable=[];
        var flag;
        var data;
        for(var i=0;i<main.allTests.length;i++){
            flag=0;
            for(var j=0;j<main.testsTaken.length;j++){
                if(main.allTests[i].testId===main.testsTaken[j].testId){
                    var data={
                        title: main.allTests[i].title,
                        totalQuestions: main.allTests[i].totalQuestions,
                        totalTime: main.allTests[i].totalTime,
                        score: main.testsTaken[j].score
                    };

                    attemptedTest.push(data);
                    flag=1;
                }
            }
            if(flag==0){
                testAvailable.push(main.allTests[i]);
            }
        }
        main.attemptedTest=attemptedTest;
        main.availableTests=testAvailable;
    };

    //function to calculate user score, etc..
    this.userMetrics=function(){
        main.noOfTests=main.testsTaken.length;
        var sum=0;
        var temp=0,minTemp=0,maxTemp=0;
        var max=0;
        // console.log(main.testsTaken);
        if(main.testsTaken.length>0){
            var min=(parseInt(main.testsTaken[0].score) / parseInt(main.testsTaken[0].totalQuestions)) *100;

            for(var j=0;j<main.testsTaken.length;j++){
                temp=(parseInt(main.testsTaken[j].score) / parseInt(main.testsTaken[j].totalQuestions)) *100;
                $scope.labels[j]=main.testsTaken[j].title;
                $scope.data[j]=temp;
                if(temp>max){
                    maxTemp=j;
                    max=temp;
                }
                if(temp<min){
                    minTemp=j;
                    min=temp;
                }
                sum+=temp;
            }
            main.avg=(sum/main.noOfTests).toFixed(2);
            main.max=main.testsTaken[maxTemp].score + ' out of ' + main.testsTaken[maxTemp].totalQuestions;
            main.min=main.testsTaken[minTemp].score + ' out of ' + main.testsTaken[minTemp].totalQuestions;

            $scope.Percent=main.avg;
        }
    };

    //function get test score information
    this.testScoreInfo=function(test){
        main.tScore=test.score;
        main.qCount=test.totalQuestions;
        var percent=(main.tScore/main.qCount)*100;
        main.tPercent=percent.toFixed(2);
    }; 

    //function to go back 
    this.goBack=function(){
        $window.history.back();
    }; 

}]);

myApp.filter('startFrom', function() {
    return function(input, start) {
    start = +start; //parse to int
    return input.slice(start);
   }
});