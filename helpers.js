/*-----------------------------------------------------------------------*/
/* ------------------------- helper functions -------------------------- */
/*-----------------------------------------------------------------------*/



//create a random alphanumerical string
const generateRandomString = () => {
  let randomStr = Math.random().toString(36).substring(2, 8);
  
  return randomStr;
}

//searchs for a user with the email provided in form
const getUserByEmail = (email, database) => {
  for (let user in database){

    if(email === database[user].email) {
      return database[user].email;
    }
  }
};

const userSearchForID = (email, database) => {
  for (let user in database){

    if(email === database[user].email) {
      return database[user].id;
    }
  }
};

const userSearchForPassword = (email, database) => {
  for (let user in database){

    if(email === database[user].email) {
      return database[user].password;
    }
  }
};



//returns list of urls based on userID

const urlsForUser = (id, database) => {
  let urlObj = {};
  let keys = Object.keys(database);
  
  keys.forEach( (shortURL) => {
    let temp = database[shortURL];
    if (id === temp.userID) {
      
      urlObj[shortURL] = temp;
    }
  });
  
  return urlObj;

};


module.exports = { generateRandomString , getUserByEmail , userSearchForID, userSearchForPassword, urlsForUser};