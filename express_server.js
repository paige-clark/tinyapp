////////////////////////////////////////////
// INITIALIZATION
////////////////////////////////////////////

const express = require("express");
const app = express();
const PORT = 3000; // default port 3000
app.set("view engine", "ejs"); // set the view engine to EJS
app.use(express.urlencoded({ extended: true })); // encodes URL data from the POST method
const cookieParser = require('cookie-parser');
app.use(cookieParser()); // allows the app to use cookieParser

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

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};

const emailFinder = function(emailToCheck) {
  for (const person in users) {
    if (users[person].email === emailToCheck) {
      return users[person];
    }
  }
  return null;
};

////////////////////////////////////////////
// ROUTES
////////////////////////////////////////////

// shows what's in our urls object
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// redirects / to urls_index
app.get("/", (req, res) => {
  return res.redirect('/urls');
});

// EJS page that shows list of short and long URLs
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase, user: users[req.cookies["user_id"]] }; // had username: req.cookies["username"]
  res.render("urls_index", templateVars);
});

// EJS page that shows register field
app.get("/register", (req, res) => {
  const templateVars = { urls: urlDatabase, user: users[req.cookies["user_id"]] }; // had username: req.cookies["username"]
  res.render("registration", templateVars);
});

// Creates an entry for the user on registration and assigns a cookie to the user
app.post("/register", (req, res) => {
  // check if either email or password field are empty
  if (!req.body.email || !req.body.password) {
    return res.status(400).send('One of the fields was left blank!');
  }
  // check if an account with the email exists already
  if (emailFinder(req.body.email)) {
    return res.status(400).send('Email already in use!');
  }
  const randomID = generateRandomString(); //generating unique code
  users[randomID] = { id: randomID, email: req.body.email, password: req.body.password };
  res.cookie('user_id', randomID);
  console.log(`New user created: ${JSON.stringify(users[randomID])}`);
  // console.log(users);
  return res.redirect("/urls");
});

// GET route to present submission form to USER
app.get("/urls/new", (req, res) => {
  const templateVars = { user: users[req.cookies["user_id"]] }; // had username: req.cookies["username"]
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
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id], user: users[req.cookies["user_id"]] }; // had username: req.cookies["username"]
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
    return res.redirect(longURL);
  } else {
    return res.redirect("/ERROR")
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
  response.clearCookie('username')
  response.redirect("/urls")
});

// 404 page for if something goes wrong
app.get("/ERROR", (req, res) => {
  const templateVars = { user: users[req.cookies["user_id"]] }
  res.render("error_page", templateVars)
});

////////////////////////////////////////////
// LISTEN
////////////////////////////////////////////

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});