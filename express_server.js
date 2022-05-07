const express = require("express");
const app = express();

const PORT = 8080; // default port 8080

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.set("view engine", "ejs");

//database objects for urls and users
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


/* ---------- helper functions --------------- */

//create a random alphanumerical string
const generateRandomString = () => {
  let randomStr = Math.random().toString(36).substring(2, 8);
  
  return randomStr;
}

//searchs for a user with the email provided in form
const userSearch = (email) => {
  for (let user in users){

    if(email === users[user][email]) {
      return users[user][email];
    }
  }
};

//returns list of urls based on userID

const urlsForUser = (id) => {

  for (let urls in urlDatabase) {
    if (id === urlDatabase[urls][userID]) {
      return urlDatabase[urls][userID];
    }
  }

};

/* ---- server routes ---- */

app.get("/", (req, res) => {
  res.redirect("/urls");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/login", (req, res) => {
  let user = req.cookies.user_id;
  const templateVars= {
    user: users[user]
    
  };
  res.cookie('user', templateVars);
  res.render('login',templateVars);
  
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




app.get("/urls", (req, res) => {
  let user = req.cookies.user_id;
  const templateVars = { 
    urls: urlDatabase,
    user: users[user],
    users 
  };

  if (!user) { 
    res.status(401).send('Please login in TinyApp to access this page');
  } else {
  res.render("urls_index", templateVars);
  }
});

app.get("/urls/new", (req, res) => {
  const user = req.cookies.user_id;
  const templateVars = { 
    urls: urlDatabase,
    user: users[user],
    users 
  };

  if (!user) { 
    res.status(401).send('Please login in TinyApp to access this page');
  } else {
  res.render("urls_new", templateVars);
  }
  
  
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

//lets the user edit their link
app.post("urls/:shortURL", (req, res) => {
  const user = req.cookies.user;
  urlDatabase[req.params.shortURL] = req.body.longURL;
  res.redirect('/urls');
});

//register user page
app.get('/register', (req, res) => {
  
  const user = req.cookies.user;

  const templateVars = { 
    user: users[user]
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
  res.cookie('user',users[userID][id]);
  res.redirect('/');
  }
})



//delete link created
app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/");
});

//logout user
app.post("/logout" , (req, res) => {
  res.clearCookie('user');
  res.redirect('/login');
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});