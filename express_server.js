/*-----------------------------------------------------------------------*/
/* ------------------------- server starters --------------------------- */
/*-----------------------------------------------------------------------*/
const express = require("express");
const app = express();

const PORT = 8080; // default port 8080
const { generateRandomString , getUserByEmail , userSearchForID, userSearchForPassword, urlsForUser} = require('./helpers');

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

const cookieParser = require('cookie-parser');
app.use(cookieParser());

const cookieSession = require('cookie-session');
app.use(cookieSession({
  name: 'session',
  keys: ['keys'],
  
  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

const bcrypt = require('bcryptjs');
const { response } = require("express");

app.set("view engine", "ejs");

/*-----------------------------------------------------------------------*/
/* --------------------------- constants ------------------------------- */
/*-----------------------------------------------------------------------*/
const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  },
};

const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW"
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW"
  }
};


/*-----------------------------------------------------------------------*/
/*---------------------------- server routes ---------------------------*/
/*---------------------------------------------------------------------*/




/*---------------------------- GET routes ---------------------------*/
app.get("/", (req, res) => {
  res.redirect("/urls");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/login", (req, res) => {
  let user = req.session.user_id;
  const templateVars = {
    user: users[user]
  };
  req.session.user_id = templateVars;
  res.render('login',templateVars);
});

app.get("/urls", (req, res) => {
  let user = req.session.user_id;
  
  const templateVars = {
    urls: urlsForUser(user, urlDatabase),
    user: users[user],
    users
  };
  console.log("get urls route", templateVars);

  if (!user) {
    
    res.redirect('/login');
  } else {
   
    res.render("urls_index", templateVars);
  }
});

app.get("/urls/new", (req, res) => {
  const user = req.session.user_id;
  const templateVars = {
    urls: urlsForUser(user, urlDatabase),
    user: users[user],
  };

  if (!user) {
    res.redirect('/login');
  } else {
    res.render("urls_new", templateVars);
  }
});

//routes short link
app.get("/urls/:shortURL", (req, res) => {
  const user = req.session.user_id;
  
  if (user !== urlDatabase[req.params.shortURL].userID) {
    res.status(403).send('You cannot edit a link you do not own');
  } else {
    const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL].longURL,
      user: users[user]};
    res.render("urls_show", templateVars);
  }
});

//redirects short link to the actual long link
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});

//register user page
app.get('/register', (req, res) => {
  const user = req.session.user_id;

  const templateVars = {
    user: users[user]
  };
  res.render("register", templateVars);
});

/*---------------------------- POST routes ---------------------------*/

//posts user registration
app.post('/register', (req, res) => {
  let userID = generateRandomString();
  let hashPass = bcrypt.hashSync(req.body.password, 10);
  
  if (!req.body.email || !req.body.password) {
    res.status(401).send('Login error! Please enter both your username and password');
  } else if (getUserByEmail(req.body.email, users) !== 'undefined') {
    res.status(401).send('Email is already registered! Please log in or use a different email');
  } else {
    users[userID] = {
      id: userID,
      email: req.body.email,
      password: hashPass
    };

    req.session.user_id = users[userID].id;
    res.redirect('/');
  }
});

//login post
app.post('/login', (req, res) => {
  let userEmail = req.body.email;
  let userPass = req.body.password;
  
  if (!getUserByEmail(userEmail, users) || getUserByEmail(userEmail, users) === 'undefined') {
    res.status(403).send('Email cannot be found! Please register your email');
  } else if (!userEmail || !userPass) {
    res.status(403).send('Please enter your email/password and please try again');
  } else if (!(bcrypt.compareSync(userPass, userSearchForPassword(userEmail, users)))) {
    res.status(403).send('Access denied! Password is incorrect');
  } else {
    req.session.user_id = userSearchForID(userEmail, users);
    res.redirect('/');
  }
});

//logout user
app.post('/logout' , (req, res) => {
  req.session = null;

  res.redirect('/login');
});

//creates a short link and posts it
app.post("/urls", (req, res) => {
  let shortURL = generateRandomString();
  
  urlDatabase[shortURL] = {
    longURL: req.body.longURL,
    userID: req.session.user_id
  };
  res.redirect(`/urls/${shortURL}`);
});

//lets the user edit their link
app.post("/urls/:shortURL", (req, res) => {
  const user = req.session.user_id;
  
  if (user !== urlDatabase[req.params.shortURL].userID) {
    res.status(403).send('You cannot edit a link you do not own');
  } else {

    urlDatabase[req.params.shortURL].longURL = req.body.longURL;
    console.log("urls post shorturl route",req.body.longURL);
    res.redirect('/');
  }
});

//delete link created
app.post("/urls/:shortURL/delete", (req, res) => {
  const user = req.session.user_id;
  
  if (user !== urlDatabase[req.params.shortURL].userID) {
    res.status(403).send('You cannot delete a link you do not own');
  } else {
    delete urlDatabase[req.params.shortURL];
    res.redirect("/");
  }
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});