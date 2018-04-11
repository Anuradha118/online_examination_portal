var mongoose = require('mongoose');

var questionSchema=new mongoose.Schema({

    question:{
        type:String
    },
    A:{
        type:String
    },
    B:{
        type:String
    },
    C:{
        type:String
    },
    D:{
        type:String
    },
    answer:{
        type:String
    }
});

var testSchema= new mongoose.Schema({

    testId:{
        type:String
    },
    title:{
        type:String
    },
    description:{
        type:String
    },
    totalQuestions:{
        type:Number
    },
    totalTime:{
        type:String
    },
    instructions:{
        type:String
    },
    questions:[questionSchema],
    createdAt:{
        type:Date,
        default:Date.now
    }
});

var Test = module.exports=mongoose.model('Test',testSchema);