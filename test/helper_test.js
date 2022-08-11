const { assert } = require('chai');

const { emailFinder } = require('../helpers.js');

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
    const user = emailFinder("user@example.com", testUsers);
    const expectedUserID = "userRandomID";
    assert.deepEqual(user, testUsers[expectedUserID]);
  });

  it('should return null if the user isn\'t found', function() {
    const user = emailFinder("notauser@example.com", testUsers);
    assert.deepEqual(user, null);
  });
});