var mongoose=require("mongoose");

var returnbookSchema=new mongoose.Schema(
{
    id:Number,
     student_name:String,
       student_id:String,
       book_name:String,
       edition:String,
       publisher:String,
       price:Number,
       pages:Number,
       created:{type:Date,default:Date.now},
      issuebookbystudent:[
          {
               
              type:mongoose.Schema.Types.ObjectId,
              ref:"IssueBook"
          }]
       
});
module.exports=mongoose.model("ReturnBookNew",returnbookSchema);