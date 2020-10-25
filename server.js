const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;
// Added static middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());

// Tables API route. Returns a list of currently occupied tables.
app.get("/api/notes", (req, res) => {
  fs.readFile(path.join(__dirname, "./db/db.json"), function (err, data) {
    if (err) {
      console.log(err);
    } else {
      notes = JSON.parse(data);
      return res.json(notes);
    }
  });
});

app.post("/api/notes", function (req, res) {
  const newNotes = req.body;
  fs.readFile(path.join(__dirname, "./db/db.json"), function (err, data) {
    if (err) {
      console.log(err);
    } else {
      notes = JSON.parse(data);
      notes.push(newNotes);
      for(let i = 0; i < notes.length; i++){
        notes[i]['id'] = i 
      }
      fs.writeFile(path.join(__dirname, "./db/db.json"), JSON.stringify(notes), function (err) {
        if (err) {
          return console.log(err)
        }
        res.json(newNotes)
      })
    }
  });
});

app.delete("/api/notes/:id", (req, res) => {
  let noteId = req.params.id
  fs.readFile(path.join(__dirname, "./db/db.json"), function (err, data) {
    if (err) {
      console.log(err);
    } else {
      notes = JSON.parse(data);
      notes = notes.filter(note => note['id'] != noteId)

      fs.writeFile(path.join(__dirname, "./db/db.json"), JSON.stringify(notes), function (err) {
        if (err) {
          return console.log(err)
        }
        res.json({status: "successfully deleted"})
      })
    }
  });
});

// Home page route
app.get("/notes", function (req, res) {
  // Send the html to screen
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

// index page route
app.get("*", function (req, res) {
  // Send the html to screen
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

// Port listener
app.listen(PORT, function () {
  console.log("App listening on PORT " + PORT);
});
