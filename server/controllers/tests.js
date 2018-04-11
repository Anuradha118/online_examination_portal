var router=require('express').Router();
var mongoose=require('./../db/mongoose');
var randomString=require('random-string');

// var User=require('./../models/User');
var Test=require('./../models/Test');
var Examinee=require('./../models/Examinee');

var responseGenerator=require('./../utils/responsegenerator');
var authenticate=require('./../utils/authenticate');
var myResponse={};

router.use(function(req,res,next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
});

//api to get all test
router.get('/allTests',function(req,res){

    Test.find({},function(err,tests){
        if(err){
            myResponse=responseGenerator.generate(true,'Some Internal Error',500,null);
            res.send(myResponse);
        }else if(!tests){
            myResponse=responseGenerator.generate(false,'No tests avaliable in Database',200,tests);
            res.send(myResponse);
        }else{
            myResponse=responseGenerator.generate(false,'Tests available in Database',200,tests);
            res.send(myResponse);
        }
    })
});

//api to save new test
router.post('/create_test',function(req,res){

    var newTest=new Test({
        testId:'TEST'+ randomString({length:5,numeric:true,letters:false,special:false}),
        title:req.body.title,
        description:req.body.description,
        totalQuestions:req.body.totalQuestions,
        totalTime:req.body.totalTime,
        instructions:req.body.instructions
    });

    newTest.save(function(err){
        if(err){
            myResponse=responseGenerator.generate(true,'Some Internal Error at 48',500,null);
            res.send(myResponse);
        }else{
            myResponse=responseGenerator.generate(false,'Test created successfully',200,newTest);
            res.send(myResponse);
        }
    });
});

//api to get single test details
router.get('/single/:testid',function(req,res){
    Test.findOne({
        '_id':req.params.testid
    },function(err,test){
        if(err){
            myResponse=responseGenerator.generate(true,'Some Internal Error',500,null);
            res.send(myResponse); 
        }else{
            myResponse=responseGenerator.generate(false,'Test Details',200,test);
            res.send(myResponse);
        }
    });
});

//api to delete a test
router.delete('/delete/:tid',function(req,res){

    Test.findOneAndRemove({
        '_id':req.params.tid
    },function(err){
        if(err){
            myResponse=responseGenerator.generate(true,'Some Internal Error',500,null);
            res.send(myResponse);
        }else{
            myResponse=responseGenerator.generate(false,'Test Deleted Successfully',200,null);
            res.send(myResponse);
        }
    });
});

//api to edit a test
router.put('/edit/:tid',function(req,res){

    Test.findOneAndUpdate({
        '_id':req.params.tid
    },req.body,function(err,test){
        if(err){
            myResponse=responseGenerator.generate(true,'Some Internal Error',500,null);
            res.send(myResponse);
        }else{
            myResponse=responseGenerator.generate(false,'Test Updated Successfully',200,null);
            res.send(myResponse);
        }
    });
});

//api to add question to a test
router.post('/add_question/:tid',function(req,res){

    Test.findByIdAndUpdate({
        '_id':req.params.tid
    },{
        '$push':{
            questions:req.body
        }
    },function(err,test){
        if(err){
            myResponse=responseGenerator.generate(true,'Some Internal Error',500,null);
            res.send(myResponse);
        }else{
            myResponse=responseGenerator.generate(false,'Questions added Successfully',200,null);
            res.send(myResponse);
        }
    });
});

//api to delete a question of a test
router.post('/delete_ques/:tid/:qid',function(req,res){

    Test.findOneAndUpdate({
        '_id':req.params.tid
    },{
        '$pull':{
            "questions":{
                '_id':req.params.qid
            }
        }
    },function(err,test){
        if(err){
            myResponse=responseGenerator.generate(true,'Some Internal Error',500,null);
            res.send(myResponse);
        }else{
            myResponse=responseGenerator.generate(false,'Questions Deleted Successfully',200,test);
            res.send(myResponse);
        }
    });
});

//api to update the question of a test
router.put('/update_question/:qid',function(req,res){

    Test.findOneAndUpdate({
        "questions._id":req.params.qid
    },{
        '$set':{
            'questions.$.question':req.body.question,
            'questions.$.A':req.body.A,
            'questions.$.B':req.body.B,
            'questions.$.C':req.body.C,
            'questions.$.D':req.body.D,
            'questions.$.answer':req.body.answer
        }
    },function(err){
        if(err){
            myResponse = responseGenerator.generate(true, "Some Internal Error", 500, null);
            res.send(myResponse);
        }else{
            myResponse = responseGenerator.generate(false, "Question Updated Successfully", 200, null);
            res.send(myResponse);
        }
    });
});

//api to save examinee details and score
router.post('/addexaminee',function(req,res){
    console.log(req.body);

    var examinee=new Examinee({
        username:req.body.username,
        email:req.body.email,
        title:req.body.title,
        testId:req.body.testId,
        score:req.body.score,
        totalQuestions:req.body.totalQuestions
    });

    examinee.save(function(err,result){
        console.log(result);
        if(err){
            myResponse=responseGenerator.generate(true,'Some Internal Error',500,null);
            res.send(myResponse);
        }else{
            for(var i=0;i<req.body.totalQuestions;i++){
                console.log(result._id);
                var answer={
                    question:req.body.testQuestions[i],
                    answer:req.body.testAnswers[i],
                    timeTaken:req.body.timeTakenForEachQuestions[i]
                };

                console.log(answer);
                Examinee.findOneAndUpdate({
                    '_id':result._id
                },{
                    '$push':{
                        'answer':answer
                    }
                },function(err){
                    console.log(err);
                });
            }

            myResponse=responseGenerator.generate(false,'Examinee Added Successfully',200,result);
            res.send(myResponse);
        }
    });
});

//api to get all tests attempted by user
router.get('/usertests',authenticate.auth,function(req,res){
    Examinee.find({
        email:req.user.email
    },function(error,tests){
        // console.log(error);
        if(error){
            myResponse=responseGenerator.generate(true,'Some Internal Error',500,null);
            res.send(myResponse);
        }else{
            myResponse=responseGenerator.generate(false,'Tests Attempted by User',200,tests);
            res.send(myResponse);
        }
    });
});

//api to get all tests attempted by a single user by admin
router.get('/admin/usertests/:email',function(req,res){
    Examinee.find({
        'email':req.params.email
    },function(err,examinees){
        if(err){
            myResponse=responseGenerator.generate(true,'Some Internal Error',500,null);
            res.send(myResponse);
        }else{
            myResponse=responseGenerator.generate(false,'Tests Attempted by User',200,examinees);
            res.send(myResponse);
        } 
    })
});

//api to get the examinees of a single test
router.get('/examinee/:tid',function(req,res){
    Examinee.find({'testId':req.params.tid},function(err,examinees){
        if(err){
            myResponse=responseGenerator.generate(true,'Some Internal Error',500,null);
            res.send(myResponse);
        }else if(!examinees){
            myResponse=responseGenerator.generate(true,'No User Attempted the Test',200,null);
            res.send(myResponse);
        }
        else{
            myResponse=responseGenerator.generate(false,'Examinees of the Test',200,examinees);
            res.send(myResponse);
        }
    })
});

// api to get all the tests attempted by admin
router.get('/admin/alltestsattempted',function(req,res){
    Examinee.find({},function(err,tests){
        if(err){
            myResponse=responseGenerator.generate(true,'Some Internal Error',500,null);
            res.send(myResponse);
        }else if(!tests){
            myResponse=responseGenerator.generate(false,'User has not attempted any tests',200,null);
            res.send(myResponse);
        }
        else{
            myResponse=responseGenerator.generate(false,'Tests Attempted by all Examinees',200,tests);
            res.send(myResponse);
        }
    })
});

module.exports=router;

