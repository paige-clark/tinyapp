////////////////////////////////////////////
// INITIALIZATION
////////////////////////////////////////////

const express = require("express");
const app = express();
const PORT = 3000; // default port 3000
app.set("view engine", "ejs"); // set the view engine to EJS
app.use(express.urlencoded({ extended: true })); // encodes URL data from the POST method
const bcrypt = require("bcryptjs"); // require bcrypt
// TODO: implement bcrypt salt
// const salt = bcrypt.genSaltSync(10);
const cookieSession = require('cookie-session');

app.use(cookieSession({
  name: 'session',
  keys: ['c8911ee4-2ab7-4bc3-9814-ecc6147ba261'],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))

// DELETE BEFORE SUBMITTING switching to cookieSession
// const cookieParser = require('cookie-parser');
// app.use(cookieParser()); // allows the app to use cookieParser

////////////////////////////////////////////
// GLOBAL SCOPE
////////////////////////////////////////////

function generateRandomString() {
  let garbledString = Math.floor((1 + Math.random()) * 0x1000000).toString(16).substring(1);
  return garbledString;
};

const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "userRandomID",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "userRandomID",
  },
  'j5jt42': {
    longURL: "https://www.neopets.ca",
    userID: "user2RandomID",
  },
};

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "eggs",
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

const urlsForUser = function (userID) {
  let newObj = {};
  for (const entry in urlDatabase) {
    if (urlDatabase[entry].userID === userID) {
      newObj[entry] = urlDatabase[entry];
    }
  }
  return newObj;
};

// using this code from Free Code Camp to validate URL for redirect for now
const isValidUrl = function(urlString) {
  try { 
    return Boolean(new URL(urlString)); 
  }
  catch(e){ 
    return false; 
  }
}

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
  const templateVars = { urls: urlsForUser(req.session['user_id']), user: users[req.session['user_id']] };
  return res.render("urls_index", templateVars);
});

// EJS page that shows register field
app.get("/register", (req, res) => {
  const templateVars = { urls: urlDatabase, user: users[req.session['user_id']] };

  // if a user is logged in, redirect to home
  if (req.session['user_id']) {
    return res.redirect("/urls");
  }
  return res.render("registration", templateVars);
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
  const hashedPassword = bcrypt.hashSync(req.body.password, 10); // creates a hashed password
  const randomID = generateRandomString(); //generating unique code
  users[randomID] = { id: randomID, email: req.body.email, password: hashedPassword };

  req.session['user_id'] = randomID;
  console.log(`New user created: ${JSON.stringify(users[randomID])}`);
  console.log(users);
  return res.redirect("/urls");
});

// GET route to show LOGIN page
app.get("/login", (req, res) => {
  const templateVars = { user: users[req.session['user_id']] };
  // if a user is logged in, redirect to home
  if (req.session['user_id']) {
    return res.redirect("/urls");
  }
  // otherwise, go to login page
  return res.render("login", templateVars);
});

// POST to LOGIN
app.post("/login", (req, res) => {
  console.log(users);
  // check if either email or password field are empty
  if (!req.body.email || !req.body.password) {
    return res.status(400).send('One of the fields was left blank!');
  }
  // check if email doesn't match records
  if (!emailFinder(req.body.email)) {
    return res.status(403).send('Email not found! Check email or make a new account.');
  }
  // check if inputted password matches stored password (using bcrypt)
  const userID = emailFinder(req.body.email).id;
  if (!bcrypt.compareSync(req.body.password, users[userID].password)) {
    return res.status(403).send('Incorrect password!');
  }
  req.session['user_id'] = userID;
  return res.redirect("/urls");
});

// GET route to present SUBMISSION FORM to user
app.get("/urls/new", (req, res) => {
  const templateVars = { user: users[req.session['user_id']] };
  if (!req.session['user_id']) {
    return res.redirect("/login");
  }
  return res.render("urls_new", templateVars);
});

// POST that submits a new entry to the database and redirects to the page for the ID
app.post("/urls", (req, res) => {
  if (!req.session['user_id']) {
    return res.send('You must be logged in to create TinyURLs!');
  }
  const newID = generateRandomString();
  urlDatabase[newID] = { longURL: req.body.longURL, userID: req.session['user_id'] };
  console.log(urlDatabase);
  return res.redirect(`/urls/${newID}`);
});

// EJS page that displays the original URL and a shortened URL
app.get("/urls/:id", (req, res) => {
  if (!req.session['user_id']) {
    return res.status(401).send('You must be logged in to view TinyURLs!');
  }
  if (!urlDatabase[req.params.id]) {
    return res.status(204).send('There is no TinyURL with that ID!');
  }
  if (req.session['user_id'] !== urlDatabase[req.params.id].userID) {
    return res.status(401).send('You do not have permission to view that TinyUrl page.')
  }
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id].longURL, user: users[req.session['user_id']] };
  return res.render("urls_show", templateVars);
});

// delete list item
app.post("/urls/:id/delete", (req, res) => {
  if (!req.session['user_id']) {
    return res.status(401).send('You must be logged in to delete TinyURLs!\n');
  }
  if (!urlDatabase[req.params.id]) {
    return res.status(204).send('There is no TinyURL with that ID so you can\'t delete it!\n');
  }
  if (req.session['user_id'] !== urlDatabase[req.params.id].userID) {
    return res.status(401).send('You do not have permission to delete that TinyUrl entry.\n')
  }
  delete urlDatabase[req.params.id];
  return res.redirect("/urls")
});

// edit list item
app.post("/urls/:id/edit", (req, res) => {
  if (req.session['user_id'] !== urlDatabase[req.params.id].userID) {
    return res.status(401).send('You do not have permission to edit that TinyUrl entry.\n');
  }
  console.log(req.body);
  urlDatabase[req.params.id].longURL = req.body.longURL;
  console.log(urlDatabase);
  return res.redirect("/urls")
}) 

// redirects you to the website associated with the shortened link
app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id].longURL;
  if (!isValidUrl(longURL)) {
    return res.redirect("/ERROR");
  }
  return res.redirect(longURL);
});

// LOGOUT user
app.post("/logout", (req, res) => {
  console.log(`Clearing the cookie for user: ${req.session['user_id']}`);
  req.session = null;
  return res.redirect("/urls")
});

// 404 page for if something goes wrong
app.get("/ERROR", (req, res) => {
  const templateVars = { user: users[req.session['user_id']] }
  return res.render("error_page", templateVars)
});

////////////////////////////////////////////
// LISTEN
////////////////////////////////////////////

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});