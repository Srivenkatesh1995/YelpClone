var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/cat_app", {
  useNewUrlParser: true
});

var catSchema = new mongoose.Schema({
  name: String,
  age: Number,
  temperament: String
});

var Cat = mongoose.model("Cat", catSchema);

// var george = new Cat({
//   name: "george",
//   age: 11,
//   temperament: "Grouchy"
// });

// george.save(function(err, cat) {
//   if (err) {
//     console.log("something went Wrong!");
//   } else {
//     console.log("Hey, You have saved the cat");
//     console.log(cat);
//   }
// });
Cat.create(
  {
    name: "Snowhite",
    age: 15,
    temperament: "Cutest"
  },
  function(err, cat) {
    if (err) {
      console.log("Error!");
    } else {
      console.log(cat);
    }
  }
);
Cat.find({}, function(err, cats) {
  if (err) {
    console.log("On NO! You have made an error 1");
    console.log(err);
  } else {
    console.log("Here are all the Cats!");
    console.log(cats);
  }
});
