const express = require("express");
const mongojs = require("mongojs");
const logger = require("morgan")
var path = require("path");
const db1 = require("./models/index")

const databaseUrl = "workout";
const collections = ["workouts"];
const db = mongojs(databaseUrl, collections);

const app = express();

app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

db.on("error", error => {
    console.log("Database Error:", error);
});
app.get("/exercise", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/exercise.html"));
});
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});
app.get("/stats", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/stats.html"));
});

app.post("/submit", (req, res) => {
    console.log(req.body);

    db.notes.insert(req.body, (error, data) => {
        if (error) {
            res.send(error);
        } else {
            res.send(data);
        }
    });
});


app.get("api/workouts", function (req, res) {
    db1.workouts.find({}).then(
        function (workout) {
            res.json(workout)
        })
});
app.get("api/workouts/range", function (req, res) {
    db1.workouts.find({}).sort({ "day": 1 }).then(function (workout) {
        res.json(workout);
    })
});


// app.post("/submit", ({ body }, res) => {
//     const book = body;

//     book.read = false;

//     db.books.save(book, (error, saved) => {
//         if (error) {
//             console.log(error);
//         } else {
//             res.send(saved);
//         }
//     });
// });

// app.get("/read", (req, res) => {
//     db.books.find({ read: true }, (error, found) => {
//         if (error) {
//             console.log(error);
//         } else {
//             res.json(found);
//         }
//     });
// });

// app.get("/unread", (req, res) => {
//     db.books.find({ read: false }, (error, found) => {
//         if (error) {
//             console.log(error);
//         } else {
//             res.json(found);
//         }
//     });
// });

// app.put("/markread/:id", ({ params }, res) => {
//     db.books.update(
//         {
//             _id: mongojs.ObjectId(params.id)
//         },
//         {
//             $set: {
//                 read: true
//             }
//         },

//         (error, edited) => {
//             if (error) {
//                 console.log(error);
//                 res.send(error);
//             } else {
//                 console.log(edited);
//                 res.send(edited);
//             }
//         }
//     );
// });

// app.put("/markunread/:id", ({ params }, res) => {
//     db.books.update(
//         {
//             _id: mongojs.ObjectId(params.id)
//         },
//         {
//             $set: {
//                 read: false
//             }
//         },

//         (error, edited) => {
//             if (error) {
//                 console.log(error);
//                 res.send(error);
//             } else {
//                 console.log(edited);
//                 res.send(edited);
//             }
//         }
//     );
// });

app.listen(3000, () => {
    console.log("App running on port 3000!");
});
