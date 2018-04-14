myApp.controller('testRunController',['$location','$window','$interval','$timeout','jwtHelper','TestService','TestInformation',function($location,$window,$interval,$timeout,jwtHelper,TestService,TestInformation){

    var main=this;

    main.i=1;
    main.index=0;
    main.question='';
    main.answer='';
    main.option1='';
    main.option2='';
    main.option3='';
    main.option4='';
    main.autosubmit=false;
    main.confirm=false;
    main.userAnswers=[];
    main.correctAnswers=[];

    //function to get the test data and display when test starts
    main.getTestData=function(){
        main.testData=TestInformation.getData();
        main.time=main.testData.totalTime;
        main.question=main.testData.questions[main.index].question;
        main.option1=main.testData.questions[main.index].A;
        main.option2=main.testData.questions[main.index].B;
        main.option3=main.testData.questions[main.index].C;
        main.option4=main.testData.questions[main.index].D;
        main.timeTaken=new Array(main.testData.totalQuestions);

        for(var j=0;j<main.testData.totalQuestions;j++){
            main.correctAnswers[j]=main.testData.questions[j].answer;
            var k=0;
            main.timeTaken[j]=0;
        }
    }; 

    main.getTestData();

    //function run timer when exam starts
    main.timer=function(){
        main.minutes=main.time-1;
        main.seconds=60;
        main.onTimeOut=function(){
            main.timeTaken[main.index] = main.timeTaken[main.index] + 1;
            main.seconds--;

            if(main.seconds==-1){
                main.seconds=60;
                main.minutes--;
            }
            if(main.minutes==-1){
                main.stop();
                alert("Time's Up! Thanks for Taking Test.");
                main.autosubmit=true;
                main.submitTest();
                main.confirm=true;
            }
        };

        var timeout=$interval(main.onTimeOut,1000);

        main.stop=function(){
            $interval.cancel(timeout);
        };
    }; 

    main.timer();

    //function to go back to previous question
    main.previousQuestion=function(){

        main.userAnswers[main.index]=main.answer;
        main.index--;
        main.i--;
        main.question=main.testData.questions[main.index].question;
        main.answer=main.testData.questions[main.index].answer;
        main.option1=main.testData.questions[main.index].A;
        main.option2=main.testData.questions[main.index].B;
        main.option3=main.testData.questions[main.index].C;
        main.option4=main.testData.questions[main.index].D;

        main.answer=main.userAnswers[main.index];
    };

    //function to go back to next question
    main.nextQuestion=function(){
        main.userAnswers[main.index]=main.answer;
        main.index++;
        main.i++;
        main.question=main.testData.questions[main.index].question;
        main.answer=main.testData.questions[main.index].answer;
        main.option1=main.testData.questions[main.index].A;
        main.option2=main.testData.questions[main.index].B;
        main.option3=main.testData.questions[main.index].C;
        main.option4=main.testData.questions[main.index].D;
        main.answer=main.userAnswers[main.index];
    }; 

    //function to submit the test
    main.submitTest=function(){
        main.userAnswers[main.index]=main.answer;
        if(!main.autosubmit){
            if($window.confirm("Are you sure you want to submit the Test ?")){
                main.stop();
                main.calculateScore();
                main.confirm=true;
            }
        }else{
            main.calculateScore();
        }
    };

    //function to calculate score and save the examinee details and answers to database
    main.calculateScore=function(){
        main.score=0;
        var username;
        for(var j=0;j<main.testData.totalQuestions;j++){
            if(main.userAnswers[j]==main.correctAnswers[j]){
                main.score++;
            }
        }

        var userInfo=jwtHelper.decodeToken(localStorage.getItem('x-auth'));

        if(userInfo.payload.firstname){
            username=userInfo.payload.firstname + ' ' + userInfo.payload.lastname;
        }else{
            username=userInfo.payload.name;
        }

        var email=userInfo.payload.email;
        var testId=main.testData.testId;
        var title=main.testData.title;
        var score=main.score;
        var questionCount=main.testData.questions.length;

        var ques=new Array(main.testData.totalQuestions);

        for(var j=0;j<main.testData.totalQuestions;j++){
            ques[j]=main.testData.questions[j].question;
        }
        var examineeInfo={
            email:email,
            username:username,
            title:title,
            testId:testId,
            score:score,
            totalQuestions:questionCount,
            testQuestions:ques,
            testAnswers:main.correctAnswers,
            timeTakenForEachQuestions:main.timeTaken
        };
        TestService.saveExaminee(examineeInfo)
            .then(function success(response){
                console.log(response);
            },function error(response){
                console.log(response);
                alert('Some error occurred');
            }
        );
    };

}]);