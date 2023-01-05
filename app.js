//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

// create connection
mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true});

// create Schema
const articleSchema = {

  title: String,
  content: String
};

// create model
const Article = mongoose.model("Article", articleSchema);


///////////////////////////////Request Targetting Article/////////////////////////


// Route Handlers Using express
app.route("/articles")

// Get request
  .get(function(req, res){

    Article.find({}, function(err, foundArticles){
      if(!err){
        res.send(foundArticles)
      } else {
        res.send(err);
      }

    });
  })

// Post request
  .post(function(req, res){
    console.log();
    console.log();
  // Create data (in the post request)
    const newArticle = new Article ({
      title: req.body.title,
      content: req.body.content
    });
    // callback function that will trigger if there're error in the save method
      newArticle.save(function (err){
        if(!err){
          res.send("successfully added a new article.")
        }else{
          res.send(err);
        }
      });
    })

// Delete request
    .delete(function(req, res){
      // Delete method from the database
      Article.deleteMany({}, function(err){
        if(!err){
          res.send("successfully deleted all articles.");
        } else{
          res.send(err);
        }
      });
    });

// // Get request
// app.get("/articles", function(req, res){
//
//   Article.find({}, function(err, foundArticles){
//     if(!err){
//       res.send(foundArticles)
//     } else {
//       res.send(err);
//     }
//
//   });
// });

// // Post request
// app.post("/articles", function(req, res){
//   console.log();
//   console.log();
// // Create data (in the post request)
//   const newArticle = new Article ({
//     title: req.body.title,
//     content: req.body.content
//   });
  // callback function that will trigger if there're error in the save method
//   newArticle.save(function (err){
//     if(!err){
//       res.send("successfully added a new article.")
//     }else{
//       res.send(err);
//     }
//   });
// });

// Delete request
// app.delete("/articles", function(req, res){
//   // Delete method from the database
//   Article.deleteMany({}, function(err){
//     if(!err){
//       res.send("successfully deleted all articles.");
//     } else{
//       res.send(err);
//     }
//   });
// });


////////////////////Request Targetting A Specific Article//////////////////////
app.route("/articles/:articleTitle")

// GET function
  .get(function(req, res){

    Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
      if(foundArticle){
        res.send(foundArticle);
      } else{
        res.send("No articles matching that title was found");
      }
    });

  })

// PUT function
  .put(function (req,res) {

    Article.replaceOne(
      {title: req.params.articleTitle},
      {title: req.body.title, content: req.body.content},
      {overwrite: true},
      function(err){
        if(!err){
          res.send("successfully updated the article");
        } else {
          res.send(err);
        }
      }
    );
  })

// PATCH function
  .patch(function (req, res) {

    Article.updateOne(
      {title: req.params.articleTitle},
      {$set: req.body},
      function(err){
        if(!err){
          res.send("successfully updated the article");
        } else {
          res.send(err);
        }
      }
    );
  })

  // DELETE function
  .delete(function (req, res){

    Article.deleteOne(
      {title: req.params.articleTitle},
      function(err){
        if(!err){
          res.send("successfully deleted");
        } else{
          res.send(err);
        }
      }
    )

  });

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
