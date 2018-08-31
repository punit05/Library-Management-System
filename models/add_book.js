var mongoose=require("mongoose");

var addSchema=new mongoose.Schema(
    {
        id:Number,
        image:String,
        genre_name:String,
         book_name:String,
        edition:String,
        publisher:String,
        price:Number,
        pages:Number,
        created:{type:Date,default:Date.now},
        issuebookbystudent:[
            {
                type:mongoose.Schema.Types.ObjectId,
              ref:"IssueBookNew"
            }],
        returnbookbystudent:[
            {
                type:mongoose.Schema.Types.ObjectId,
              ref:"ReturnBookNew"
            }]
        
    });
    
    //now this variable will use the schema,compiled them into the model
    

module.exports=mongoose.model("AddBook",addSchema);