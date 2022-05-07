
/*-----------------------------------------------------------------------*/
/* ------------------------- helper functions -------------------------- */
/*-----------------------------------------------------------------------*/



//create a random alphanumerical string
const generateRandomString = () => {
  let randomStr = Math.random().toString(36).substring(2, 8);
  
  return randomStr;
}

//searchs for a user with the email provided in form
const userSearch = (email) => {
  for (let user in users){

    if(email === users[user].email) {
      return users[user].email;
    }
  }
};

const userSearchForID = (email) => {
  for (let user in users){

    if(email === users[user].email) {
      return users[user].id;
    }
  }
};

const userSearchForPassword = (email) => {
  for (let user in users){

    if(email === users[user].email) {
      return users[user].password;
    }
  }
};



//returns list of urls based on userID

const urlsForUser = (id) => {
  let urlObj = {};
  let keys = Object.keys(urlDatabase);
  
  keys.forEach( (shortURL) => {
    let temp = urlDatabase[shortURL];
    if (id === temp.userID) {
      
      urlObj[shortURL] = temp;
    }
  });
  
  return urlObj;

};

