var mongoose=require('mongoose');

var answerSchema=new mongoose.Schema({

    question:{
        type:String
    },
    answer:{
        type:String
    },
    timeTaken:{
        type:String,
        default:0
    }
});

var examineeSchema=new mongoose.Schema({

    username:{
        type:String
    },
    email:{
        type:String
    },
    title:{
        type:String
    },
    testId:{
        type:String
    },
    score:{
        type:String
    },
    totalQuestions:{
        type:String
    },
    answer:[answerSchema],
    takenAt:{
        type:Date,
        default:Date.now
    }

});

var Examinee=module.exports=mongoose.model('Examinee',examineeSchema);