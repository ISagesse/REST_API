
const mongoose = require('mongoose');
const express = require('express');
const bodyparser = require('body-parser');
const ejs = require('ejs');

const port = 3000;
const app = express();
app.use(bodyparser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/wikiDB', {useNewUrlParser: true, useUnifiedTopology: true});

const articleSchema = {
  title: String,
  content: String
};

const Article = mongoose.model("Article", articleSchema);


/////////////////////////////////////////////// ROUTE TARGETING ALL THE ALL THE ARTICLE ////////////////////////////////////////////////////////////
app.route("/articles")

.get((req, res) => {
  Article.find((err, foundArticles) => {
    if (!err) {
      res.send(foundArticles);
    }else {
      res.send(err);
    }
  })
})

.post((req, res) => {
  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content
  });
  newArticle.save( (err) => {
    if (!err) {
      res.send("added the new article");
    }else {
      res.send(err);
    }
  });
})

.delete((req, res) => {
  Article.deleteMany((err) => {
    if (!err) {
      res.send("Deleted all the articles.");
    }else {
      res.send(err);
    }
  })
});


/////////////////////////////////////////////// ROUTE TARGETING A SPECIFIC ARTICLE ////////////////////////////////////////////////////////////

app.route("/articles/:articleName")

.get((req, res) => {
  Article.findOne({title: req.params.articleName}, (err, foundArticle) => {
    if (foundArticle) {
      res.send(foundArticle);
    }else {
      res.send("This article doesn't exist, please try again");
    }
  })
})

.put((req, res) => {
  Article.update({title: req.params.articleName},{title: req.body.title, content: req.body.content}, {overwrite: true}, (err, foundArticle) => {
    if (!err) {
      res.send("updated the article");
    }
  })
})

.patch((req, res) => {
  Article.update({title: req.params.articleName}, {$set: req.body}, (err) => {
    if (!err) {
      res.send("added a new field");
    }else {
      res.send(err);
    }
  })
})

.delete((req, res) => {
  Article.deleteOne({title: req.params.articleName}, (err) => {
    if (!err) {
      res.send("this article is deleted");
    }else {
      res.send(err);
    }
  })
})

app.listen(port, () => {
  console.log("Server started on port 3000");
})
