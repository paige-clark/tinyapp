////////////////////////////////////////////
// INITIALIZATION
////////////////////////////////////////////

const express = require("express");
const app = express();
const PORT = 3000; // default port 3000
app.set("view engine", "ejs"); // set the view engine to EJS
app.use(express.urlencoded({ extended: true })); // encodes URL data from the POST method
const cookieParser = require('cookie-parser');
app.use(cookieParser());

////////////////////////////////////////////
// GLOBAL SCOPE
////////////////////////////////////////////

function generateRandomString() {
  let garbledString = Math.floor((1 + Math.random()) * 0x1000000).toString(16).substring(1);
  return garbledString;
};

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

////////////////////////////////////////////
// ROUTES
////////////////////////////////////////////

// allows the app to use cookieParser

// shows what's in our urls object
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// EJS page that shows list of short and long URLs
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase, username: req.cookies["username"] };
  res.render("urls_index", templateVars);
});

// GET route to present submission form to USER
app.get("/urls/new", (req, res) => {
  const templateVars = { username: req.cookies["username"] };
  res.render("urls_new", templateVars);
});

// POST that submits a new entry to the database and redirects to the page for the ID
app.post("/urls", (req, res) => {
  const newID = generateRandomString();
  const newSubmission = urlDatabase[newID] = req.body.longURL;
  res.redirect(`/urls/${newID}`) //ask if this is correct tomorrow
});

// EJS page that displays the original URL and a shortened URL
app.get("/urls/:id", (req, res) => {
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id], username: req.cookies["username"] };
  res.render("urls_show", templateVars);
});

// delete list item
app.post("/urls/:id/delete", (request, response) => {
  delete urlDatabase[request.params.id];
  response.redirect("/urls")
});

// edit list item
app.post("/urls/:id/edit", (request, response) => {
  console.log(request.body);
  urlDatabase[request.params.id] = request.body.longURL;
  response.redirect("/urls")
}) 

// redirects you to the website associated with the shortened link
app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id];
  if (longURL) {
    res.redirect(longURL);
  } else {
    res.redirect("/ERROR")
  }
});

// creates login cookie
app.post("/login", (request, response) => {
  console.log(`New cookie created: ${request.body.username}`);
  response.cookie('username', request.body.username);
  response.redirect("/urls")
});

// clears login cookie
app.post("/logout", (request, response) => {
  console.log(`Clearing the cookie: ${request.cookies["username"]}`);
  // urlDatabase = {};
  response.clearCookie('username')
  response.redirect("/urls")
});

// 404 page for if something goes wrong
app.get("/ERROR", (req, res) => {
  const templateVars = { username: req.cookies["username"] }
  res.render("error_page", templateVars)
});

////////////////////////////////////////////
// LISTEN
////////////////////////////////////////////

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});