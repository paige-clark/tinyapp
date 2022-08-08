////////////////////////////////////////////
// INITIALIZATION
////////////////////////////////////////////

const express = require("express");
const app = express();
const PORT = 3000; // default port 3000
app.set("view engine", "ejs"); // set the view engine to EJS

////////////////////////////////////////////
// DATABASE
////////////////////////////////////////////

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

////////////////////////////////////////////
// GETS
////////////////////////////////////////////

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

////////////////////////////////////////////
// LISTEN
////////////////////////////////////////////

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});