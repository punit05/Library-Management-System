var express=require("express");
var app=express();
var bodyParser=require("body-parser");
var mongoose=require("mongoose");
var Genre=require("./models/genre");
var IssueBookNew=require("./models/IssueBook");
var ReturnBookNew=require("./models/ReturnBook");
var AddBook=require("./models/add_book");
var passport=require("passport");
var LocalStrategy=require("passport-local");
var User=require("./models/user");
var methodOverride=require("method-override");

//var seedDB=require("./seeds");

mongoose.connect("mongodb://localhost/LMS");
//Password config
app.use(require("express-session")(
    {
        secret:"sab ho jayega",
        resave:false,
        uninitialized:false
        
        
    }));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//var flash=require("connect-flash");
// 
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));
//seedDB();
app.use(methodOverride("_method"));

app.use(function(req,res,next)
{
    res.locals.currentUser=req.user;
    next();
});

//  app.use(function(req, res, next) {
//      res.locals.addbookejs=req.addbook;
     
//      next();
//  });
 
app.set("view engine","ejs");
app.get("/",function(req,res)
{
    res.render("home.ejs");
});
app.get("/genre",function(req,res)
{
     Genre.find({},function(err,allGenres)
   {
       if(err)
       {
           console.log(err);
       }
       {
           
     res.render("index.ejs",{genres_ejs:allGenres,currentUser:req.user});//req.user will have the name of the user who is logged in      
       }
   });
});
 app.post("/genre",isLoggedIn,function(req,res)
{
    var name=req.body.name;
    var image=req.body.image;
    var desc=req.body.description;
    
    
    
       var newgenre={name:name,image:image,description:desc};
   // campgrounds.push(newcampground);
    Genre.create(newgenre,function(err,newlycreated)
    {
       if(err)
       {
           console.log(err);
       }
       else 
       {
           res.redirect("/genre");
       }
    });
  });
app.get("/genre/new",isLoggedIn,function(req,res)
{
    res.render("lms.ejs");
});
//Show infor about one genre we need to put the id because we need to know wich genre we are putting the book
app.get("/genre/:id",function(req,res)
{
    //populate execute to use association
    Genre.findById(req.params.id).populate("book").exec(function(err,foundGenre)
    {
        if(err)
        {
         //   console.log("POPULATE");
            console.log(err);
        }
        else
        {
       //     console.log(foundGenre);
            res.render("show.ejs",{genre:foundGenre});
        }
    });
});
//edit and update route
app.get("/genre/:id/edit",function(req,res)
{
    Genre.findById(req.params.id,function(err,foundGenre)
    {
        if(err)res.redirect("/genre");
        else 
        {
            res.render("edit_genre.ejs",{genre:foundGenre});        
        }
    });
    
    
});
app.put("/genre/:id",function(req,res)
{
    Genre.findByIdAndUpdate(req.params.id,req.body.genre,function(err,foundedGenre)
    {
        if(err)
        res.redirect("/genre");
        else 
        {
            res.redirect("/genre/"+req.params.id);
        }
    });
});

app.get("/genre/:id/add/new",isLoggedIn,function(req,res)
{
    Genre.findById(req.params.id).populate("issuebookbystudent").exec(function(err,genre)
    {
       // console.log(req.);
        if(err)
        
        {
            console.log(err);
        }
        else 
        {
            
             res.render("add.ejs",{genre:genre});
        }
        
    });
   
});
app.post("/genre/:id/add",function(req,res)
{
    Genre.findById(req.params.id,function(err,genre)
    {
        if(err)
        {
            console.log(err);
            res.redirect("/genre");
        }
        else 
        {
    AddBook.create(req.body.add_book_comment,function(err,newlyadd_book)
    {
        
        if(err)
        {
            console.log(err);
        }
        else 
        {
            //now associate with genre
        genre.book.push(newlyadd_book);
            genre.save();
            console.log(genre);
            res.render("show.ejs",{newlyadd_bookejs:newlyadd_book,genre:genre});
            
            
        }
    });

            
        }
        
    });
    
    
});
app.get("/genre/:id/add/:issued_id/new_issue",isLoggedIn,function(req,res)
{
   
   
   
    
//   console.log(req.user);
  AddBook.findById(req.params.issued_id,function(err,foundBook)
  {
      if(err)
      {
          console.log(err);
     res.redirect("back");
     } else 
      {
            res.render("issue_book.ejs",{genre_id:req.params.id,issued_id:req.params.issued_id,foundBookejs:foundBook});
      }
  });
    
});

app.post("/genre/:genre_id/add/:issued_id/genre/:genre_id/add/:issued_id/new_issue/display",function(req, res) {
    
   //  Genre.findById(req.params.id).populate("issuebookbystudent").exec(function(err,genre)
    
     AddBook.findById(req.params.issued_id).populate("returnbookbystudent").exec(function(err,addbook)
    {
        if(err)
        {
            console.log(err);
            res.redirect("/genre");
        }
        else 
        {
    IssueBookNew.create(req.body.bookandstud,function(err,newlyissue_book)
    {
        if(err)
        {
            console.log(err);
        }
        else 
        {
            //now associate with Addbook
        addbook.issuebookbystudent.push(newlyissue_book);
            addbook.save();
       // console.log(addbook.book_name);
         //   console.log("AND");
           // console.log(newlyissue_book.book_name);
            res.render("display.ejs",{newlyissue_bookejs:newlyissue_book,addbookejs:addbook});
            
            
        }
    });

            
        }
        
    });
    
});
app.get("/genre/:id/add/:returned_id/return_book",function(req, res) {
  AddBook.findById(req.params.returned_id,function(err,returnBook)
  {
      if(err)
      {
          console.log(err);
     res.redirect("back");
     } else 
      {
            res.render("return_book.ejs",{genre_id:req.params.id,returned_id:req.params.returned_id,foundBookejs:returnBook});
      }
  });
     
});


app.post("/genre/:id/add/:returned_id/genre/:id/add/:returned_id/return_book/displayret",function(req, res) {
    
   //  Genre.findById(req.params.id).populate("issuebookbystudent").exec(function(err,genre)
    
     AddBook.findById(req.params.returned_id).populate("issuebookbystudent").exec(function(err,returnbook)
    {
        if(err)
        {
            console.log(err);
            res.redirect("/genre");
        }
        else 
        {
    ReturnBookNew.create(req.body.bookandstudret,function(err,newlyreturn_book)
    {
        if(err)
        {
            console.log(err);
        }
        else 
        {
            //now associate with Addbook
        returnbook.returnbookbystudent.push(newlyreturn_book);
            returnbook.save();
        //console.log(addbook.book_name);
          //  console.log("AND");
        //    console.log(newlyissue_book.book_name);
            res.render("displayret.ejs",{newlyreturn_bookejs:newlyreturn_book,returnbookejs:returnbook});
            
            
        }
    });

            
        }
        
    });
    
});

///==============Auth routes============

app.get("/login",function(req,res)
{
    res.render("login");
    
});
app.post("/login",passport.authenticate("local",
{
    successRedirect:"/genre",
    failureRedirect:"/login"
}),function(req,res){
});

app.get("/register",function(req,res)
{
    res.render("register.ejs");
});
app.post("/register",function(req,res)
{
   var newUser=new User({username:req.body.username});
    User.register(newUser,req.body.password,function(err,user)
    {
        if(err)
        {
            console.log(err);
            return res.render("register.ejs");
        }
        else 
        {
            passport.authenticate("local")(req,res,function()
            {
                res.redirect("/genre");
            });
        }
    
    });
    
});


app.get("/logout",function(req,res)
{
    req.logout();
    res.redirect("/genre");
})
/*
app.get("/lms/add_student",function(req,res)
{
    res.render("add_student.ejs");
});
app.post("/lms/add_student",function(req,res)
{
   var student_id=req.body.student_id;
   var name=req.body.name;
   var stu_reg_no=req.body.stu_reg_no;
   var fname=req.body.fname;
   var course=req.body.course;
   var department=req.body.department;
   var year=req.body.year;
   var semester=req.body.semester;
   var newStudent={student_id:student_id,name:name,stu_reg_no:stu_reg_no,fname:fname,course:course,department:department,year:year,semester:semester
  };
  Student.create(newStudent,function(err,newlystudent)
  {
      if(err)
      {
          console.log(err);
      }
      else 
      {
         // console.log(newlystudent);
         res.redirect("/lms");
         
      }
  });
   
   
    
});


*/

function isLoggedIn(req,res,next)
{
    if(req.isAuthenticated())
    {
        return next();
    }
    res.redirect("/login");
};

app.listen(process.env.PORT,process.env.IP,function()
{
    console.log("Server started");
});