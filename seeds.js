var mongoose=require("mongoose");
var Genre=require("./models/genre");
var AddBook=require("./models/add_book");
var data=[
    {
        name:"LOVE",
        image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXmG_hVLiJoQKjyjbC1NU6msPwSDt9frE0cmgak1AInXTzKjxr",
        description:"chiii chii"
    },
    {
        name:"Novel",
               image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXmG_hVLiJoQKjyjbC1NU6msPwSDt9frE0cmgak1AInXTzKjxr",
        description:"they are good"
    },
    {
        name:"fiction",
                image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXmG_hVLiJoQKjyjbC1NU6msPwSDt9frE0cmgak1AInXTzKjxr",
        description:"Love them "
    }
    
    
    
    ]


function seedDB()
{
    
    //Remove genre
    
    Genre.remove({},function(err)
{
    if(err)console.log(err);
    else {
    console.log("removed genre");}
    
    
    data.forEach(function(seed)
{
    Genre.create(seed,function(err,gen)
    {
     if(err)
     {
         console.log(err);
     }
     else
     {
         console.log("added a genre");
         AddBook.create(
             {
                 genre_name:"LOVE",
                 book_name:"Lodu"
             },function(err,adds)
             {
                 if(err)
                 {console.log("Add Book");
                 console.log(err);
                } else 
                 {
                     gen.book.push(adds);
                     gen.save();
                     console.log("created new genre")
                 }
             });
         
     }
        
    });
});
    
    
    
});

}
//add a few genre






module.exports=seedDB;