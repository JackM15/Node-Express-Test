const express = require('express');
const hbs = require('hbs');
const fs = require('fs');
//if process.env.PORT doesnt exist, use port 3000 as default
const port = process.env.PORT || 3000;
var app = express();

//middleware custom to log to console
app.use((req, res, next) => {
    var now = new Date().toString();
    var log = `${now} : ${req.method} ${req.url}`;
    //write to a log file!
    console.log(log);
    fs.appendFile('server.log', log + '\n', (err) => {
        if (err) {
            console.log("Unable to append to server.log");
        }
    });
    //tell express we're done and can continue
    next();
});

//maintenance page middleware (no next() so will override everything else)
// app.use((req, res, next) => {
//     res.render("maintenance.hbs");
// });

//middleware to set relative path to public folder for assets
app.use(express.static(__dirname + "/public"));

//add partials support for handlebars
hbs.registerPartials(__dirname + "/views/partials");
//use handlebars template engine
app.set("view engine", "hbs");

//helpers
hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear();
});

hbs.registerHelper("screamIt", (text) => {
    return text.toUpperCase();
});

//routes (request/response)
app.get("/", (req, res) => {
    res.render("home.hbs", {
        pageTitle: "Home Page",
        welcomeMessage: "Hello there, welcome!"
    })
});

app.get("/about", (req, res) => {
    res.render("about.hbs", {
        pageTitle: 'About Page',
    });
});

app.get("/bad", (req, res) => {
    res.send({
        errorMessage: "Error handling request."
    });
});

app.get("/projects", (req, res) => {
    res.render("projects.hbs", {
        pageTitle: "Portfolio Page"
    });
})

//start server (port number, console alert)
app.listen(port, () => {
    console.log(`Server Started on Port ${port}.`);
});
