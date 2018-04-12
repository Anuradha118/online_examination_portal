myApp.service('TestService',function($http){
    var main=this;

    // create test
    main.createTest=function(data){
        return $http.post('/test/create_test',data);
    };

    //add question
    main.addQuestion=function(tid,data){
        return $http.post('/test/add_question/'+tid,data);
    };

    // get all tests present in db
    main.getAllTests=function(){
        return $http.get('/test/allTests');
    };

    // get single test details
    main.getTest=function(testid){
        return $http.get('/test/single/'+testid);
    };

    // update the question
    main.updateQuestion=function(qid,data){
        return $http.put('/test/update_question/'+qid,data);
    };

    // update the test
    main.updateTest=function(tid,data){
        return $http.put('/test/edit/'+tid,data);
    };

    // delete the test
    main.deleteTest=function(tid){
        return $http.delete('/test/delete/'+tid);
    };

    // delete the question
    main.deleteQuestion=function(tid,qid){
        return $http.post('/test/delete_ques/'+tid+'/'+qid);
    };

    //get all registered users
    main.getAllUsers=function(){
        return $http.get('/user/allUsers');
    };
    
    //get all examinees of a test
    main.getExamineesofTest=function(tid){
        return $http.get('/test/examinee/'+tid);
    };

    // get all tests attempted by an examinee by admin
    main.getExamineeTests=function(email){
        return $http.get('/test/admin/usertests/'+email);
    };

    // get all tests attempted by an examinee
    main.getExamineeTakenTests=function(data){
        return $http.get('/test/usertests',{
            headers:{
                'x-auth':data.token
            }
        });
    };

    //save examinee details to the database
    main.saveExaminee=function(data){
        return $http.post('/test/addexaminee',data);
    };

    // get all attempted tests by admin
    main.getAllAttemptedTest=function(){
        return $http.get('/test//admin/alltestsattempted');
    };
})