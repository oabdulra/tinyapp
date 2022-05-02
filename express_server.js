const express = require("express");
const app = express();

const PORT = 8080; // default port 8080

const generateRandomString = () => {

  let randomStr = Math.random().toString(36).substring(2, 8);
  return randomStr;

}
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

//login post
app.post('/login', (req, res) => {
  let username = req.body.username;
  res.cookie('username', username);
  res.redirect('/urls');
});

app.get("/urls", (req, res) => {
<<<<<<< HEAD
  const templateVars = { urls: urlDatabase,
    username: req.cookies["username"]
   };
=======
  const templateVars = { 
    urls: urlDatabase,
    username: req.cookies['username'] };
>>>>>>> feature/cookies
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const templateVars = { 
    urls: urlDatabase,
    username: req.cookies['username'] };
  res.render("urls_new", templateVars);
});

<<<<<<< HEAD
/*app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});*/

//login post
app.post('/login', (req, res) => {
  res.cookie('username', req.body.username);
  res.redirect('/urls');
});

=======
>>>>>>> feature/cookies
//creates a short link and posts it
app.post("/urls", (req, res) => {
  let shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`/urls/${shortURL}`);
});

//routes short link
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: req.params.longURL,
  username: req.cookies['username'] };
  res.render("urls_show", templateVars);
});


/*app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});*/


//redirects short link to the actual long link
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

//lets the user edit their linnk
app.post("urls/:shortURL", (req, res) => {
  urlDatabase[req.params.shortURL] = req.body.longURL;
  res.redirect('/urls');
});

//delete link created
app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});

<<<<<<< HEAD
=======
//logout user
app.post("/logout" , (req, res) => {
  res.clearCookie('username');
  res.redirect('/urls');
});
>>>>>>> feature/cookies

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});