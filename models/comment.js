 let mongoose = require("mongoose");

 let Schema = mongoose.Schema;
 let CommentSchema = new Schema({
   name:{
     type: String,
   
   },
   body: {
     type: String,
     require: true
   },
  
  });
 let Comment = mongoose.model("Comment", CommentSchema);
 module.exports = Comment;
