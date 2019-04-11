let express = require("express");
let router = express.Router();
let path = require("path");
let axios= require("axios");

let request = require("request");
let cheerio = require("cheerio");


let db = require("../models");

    
router.get("/", function(req,res){
      res.render("index")
     
      console.log("index")
    
    });

router.get("/scrape", function(req, res){
  axios.get("http://www.theverge.com").then(function(response){

    var $ = cheerio.load(response.data);
    var titlesArray = [];

    $(".c-entry-box--compact__title").each(function(i, element){
      var result = {};

      result.title = $(this)
        .children("a")
        .text();
      result.link = $(this)
        .children("a")
        .attr("href");
        if(result.title !== "" && result.link !==""){
          if(titlesArray.indexOf(result.title) == -1){
            titlesArray.push(result.title);
  
            db.Article.count({ title: result.title}, function(err, test){
              if(test === 0){
                let entry = new Article(result);
  
                entry.save(function(err, doc){
                  if (err){
                    console.log(err);
                  } else {
                    console.log(doc);
                  }
                })
              }
            })
          }else{
            console.log("Article already exists.");
          }
        } else {
          console.log("Not saved to DB, missing data");
        }
    });
    
    res.redirect("/");
    
  });
});
router.get("/articles", function(req,res){
  db.Article.find({}).sort({_id:-1})
    .then(function(dbArticle){
      let object = {
        article: dbArticle
      }
      res.render("index", object)
      console.log(dbArticle);
    })
    .catch(function(err){
      console.log(err);
    });
});

router.get("/articles/:id", function(req,res){
  var articleId = req.params.id;
  var hbsObj = {
    article:Article,
    body:""
  };
  var link = "";
  var content = "";
  db.Article.findOne({_id: articleId })
  .populate("comment")
  .then(function(dbArticle){
    hbsObj.article = doc;
    link = doc.link;
     content =  $(".l-col_main").each(function(i, element){
            console.log(element, "element Test")
            hbsObj.body = $(this)
            .children(".c-entry-content")
            .children("p")
            .text(); 
            console.log(content, 'article from page');
            return false;
    // res.json(dbArticle);
  })
  .catch(function(err){
    res.json(err);
  });
});
router.post("/articles/:id", function(req, res){
  db.Comment.create(req.body)
    .then(function(dbComment){
      return db.Article.findOneAndUpdate({_id: req.params.id},{comment:dbComment._id}, { new: true });
    })
    .then(function(dbArticle){
      res.render("index", dbArticle)
    })
    .catch(function(err){
      res.json(err);
    });
});


  let newComment = new Comment(commentObj);

  newComment.save(function(err, doc) {
    if (err){
      console.log(err);
    } else {
      console.log(doc._id);
      console.log(articeId);

      Article.findOneAndUpdate(
        {_id: req.params.id},
        { $push: { comment: doc._id } },
        { new: true }
      ).exec(function(err, doc){
        if (err){
          console.log(err);
        } else {
          res.redirect("/readArticle/" + articleId);
        }
      })

    }
  })
})




module.exports = router;
