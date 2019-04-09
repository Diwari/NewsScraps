let mongoose = require("mongoose");
let logger = require("morgan");

let axios = require("axios");
let cheerio = require("cheerio");

let express = require("express");
let app = express();
let PORT = process.env.PORT || 3000;
let routes = require("./controller/controller.js");
// let Comment = require("../models/comment.js");
// let Article = require("../models/articles.js");

app.use(logger("dev"));
app.use(express.urlencoded({ extended: true}));
app.use(express.json());

app.use(express.static("public"));

let exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main"}));
app.set("view engine", "handlebars");
app.use(routes);


 mongoose.connect("mongodb://localhost/NewScraps")
 let db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function(){
  console.log("Mongoose Connected");
});



app.listen(PORT, function(){
  console.log("Listening on PORT " + PORT);
}) 

