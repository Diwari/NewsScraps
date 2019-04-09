let mongoose = require("mongoose");

let Schema = mongoose.Schema;
let ArticleSchema = new Schema({
  title:{
    type: String,
    required: true
  },
  link: {
    type: String,
    require: true
  },
  comment:[{
    type: Schema.Types.ObjectId,
    ref: "Comment"
  }]
})

let Article = mongoose.model("Article", ArticleSchema);
module.exports = Article;