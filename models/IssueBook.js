var mongoose=require("mongoose");

var issuebookSchema=new mongoose.Schema(
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
      returnbookbystudent:[
          {
               
              type:mongoose.Schema.Types.ObjectId,
              ref:"ReturnBook"
          }]
       
});
module.exports=mongoose.model("IssueBookNew",issuebookSchema);