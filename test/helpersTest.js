const { assert } = require('chai');
const { getUserByEmail, userSearchForID } = require('../helpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail("user@example.com", testUsers);
    const actual = user.id;
    const expectedUserID = "userRandomID";
    assert.equal(actual, expectedUserID);
  });
  it('should return a user with valid email', function() {
    const user = getUserByEmail("user2@example.com", testUsers);
    const expectedUserID = "user2RandomID";
    const actual = user.id;
    assert.equal(actual, expectedUserID);
  });
  it('should return as undefined when entering email that isnt there', function() {
    const user = getUserByEmail("pizzaman@gmail.com", testUsers);
    const expectedUserID = "undefined";
    assert.equal(user, expectedUserID);
  });
  

});
