const express = require("express");
const app = express();

const PORT = 8080; // default port 8080

//user database object
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
}


/* ---------- helper functions --------------- */

//create a random alphanumerical string
const generateRandomString = () => {
  let randomStr = Math.random().toString(36).substring(2, 8);
  
  return randomStr;
}

//searchs for a user with the email provided in form
const userSearch = (email) => {
      return users[email];
};

/* ---- server routes ---- */

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
  res.redirect("/urls");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/login", (req, res) => {
  let userEmail = req.cookies.user;
  const templateVars= {
    user: users[userEmail]
    
  };
  res.cookie('username', templateVars);
  res.render('login',templateVars);
  res.redirect('/urls');
})

//login post
app.post('/login', (req, res) => {
  let userEmail = userSearch(req.body.email);
  let userPass = req.body.password;

  if (!userEmail) {
    res.status(403).send('Email cannot be found! Please register your email');
  } else if (userEmail && !userPass) {
    res.status(403).send('The password is incorrect, please try again');
  } else {
    let user = req.cookies.email;
    res.redirect('/');
  }
  
});

//logout user
app.post("/logout" , (req, res) => {
  res.clearCookie('user');
  res.redirect('/');
});


app.get("/urls", (req, res) => {
  const templateVars = { 
    urls: urlDatabase,
    user: users[req.cookies.user],
    users };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const templateVars = { 
    urls: urlDatabase,
    user: req.cookies.user,
    users };
  res.render("urls_new", templateVars);
});


//creates a short link and posts it
app.post("/urls", (req, res) => {
  let shortURL = generateRandomString();
  
  urlDatabase[shortURL] = {
    longURL: req.body.longURL,
    user: req.cookies.user
  };
  res.redirect(`/urls/${shortURL}`);
});

//routes short link
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: req.params.longURL,
  user: users[user][email]};
  res.render("urls_show", templateVars);
});

//redirects short link to the actual long link
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});


app.get('/register', (req, res) => {
  
  const user = req.cookies.user;

  const templateVars = { 
    user,
    users 
  };
  res.render("register", templateVars);

});

app.post('/register', (req, res) => {
  let userID = generateRandomString();

  if(!req.body.email || !req.body.password) {
    res.status(400).send('Login error! Please enter both your username and password');
  } else if (userSearch(req.body.email)){
    res.status(400).send('Email is already registered! Please log in or use a different email')

  } else {
  users[userID] = {
    id: userID,
    email: req.body.email,
    password: req.body.password
  }
  res.cookie('user',userID);
  res.redirect('/');
  }
})

//lets the user edit their link
app.post("urls/:shortURL", (req, res) => {
  urlDatabase[req.params.shortURL] = req.body.longURL;
  res.redirect('/urls');
});

//delete link created
app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/");
});


app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});