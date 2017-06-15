var express       = require("express"),
app               = express(),
bodyParser        = require("body-parser"),
mongoose          = require("mongoose"),
methodOverride    = require("method-override");

// APP CONFIG
mongoose.connect("mongodb://localhost/mp3");
app.set("view engine", "ejs");
//serve the custom stylesheet
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
//whenever you get a request with this method as a parameter, treat it as a PUT request
app.use(methodOverride("_method"));

// MONGOOSE/MODEL CONFIG
var songSchema = new mongoose.Schema({
    title: String,
    artist: String,
    image: String,
    songURL: String,
    created: {type: Date, default: Date.now}
});

var Song = mongoose.model("Song", songSchema);

app.get("/", function(req, res) {
    res.redirect("/songs");
});

app.get("/songs", function(req, res) {
    //retrieve all the songs from the database
    Song.find({}, function(err, songs){
        if (err) {
            console.log("Error!");
        } else {
            res.render("index", {songs: songs});
        }
    });
});

//NEW ROUTE
app.get("/songs/new", function(req, res){
     res.render("new");
    });

//CREATE ROUTE
app.post("/songs", function(req, res){
    //create song
    Song.create(req.body.songs, function(err, newSong) {
         if(err) {
           res.render("new");
          } else {
             //then, redirect
             res.redirect("/songs");
          }
    });
});

//SHOW ROUTE
app.get("/songs/:id", function(req, res) {
    Song.findById(req.params.id, function(err, foundSong){
        if (err) {
            res.redirect("/songs");
        } else {
            res.render("show", {song: foundSong});
        }
    })
})


//EDIT ROUTE
app.get("/songs/:id/edit", function(req, res){
    Song.findById(req.params.id, function (err, foundSong){
        if(err){
            res.redirect("/songs");
        } else {
            res.render("edit", {song: foundSong});
        }
    })
});

//UPDATE ROUTE
app.put("/songs/:id", function(req, res){
    //this method takes 3 arguments:
    // (id, newData, callback)
    Song.findByIdAndUpdate(req.params.id, req.body.songs, function(err, updatedSong){
        if(err) {
            res.redirect("/songs");
        } else {
            res.redirect("/songs/" + req.params.id);
        }
    });
});

//DELETE ROUTE
app.delete("/songs/:id", function(req, res){
   //destroy blog
   Song.findByIdAndRemove(req.params.id, function(err){
       if(err) {
           res.redirect("/songs");
       } else {
           res.redirect("/songs");
       }
   });
});


//RESTFUL ROUTES


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server's up!");
});
