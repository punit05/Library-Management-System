var mongoose=require("mongoose");

var genreSchema=new mongoose.Schema(
{
    name:String,
       image:String,
       description:String,
      book:[
          {
              type:mongoose.Schema.Types.ObjectId,
              ref:"AddBook"
          }
          ],
         issuebookbystudent:[
          {
              type:mongoose.Schema.Types.ObjectId,
              ref:"IssueBookNew"
          }
          ],
          returnbookbystudent:[
          {
              type:mongoose.Schema.Types.ObjectId,
              ref:"ReturnBookNewBook"
          }
          ]
           
       
       
       
});
module.exports=mongoose.model("Genre",genreSchema);