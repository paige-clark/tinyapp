// a function that returns a user object for a given email
const emailFinder = function(emailToCheck, database) {
  for (const person in database) {
    if (database[person].email === emailToCheck) {
      return database[person];
    }
  }
  return null;
};

// generates a random string of numbers and characters (6 chars long)
const generateRandomString = function() {
  let garbledString = Math.floor((1 + Math.random()) * 0x1000000).toString(16).substring(1);
  return garbledString;
};

// when given a userID, looks at the urlDatabase and returns an object with all their entries
const urlsForUser = function(userID, urlDatabase) {
  let newObj = {};
  for (const entry in urlDatabase) {
    if (urlDatabase[entry].userID === userID) {
      newObj[entry] = urlDatabase[entry];
    }
  }
  return newObj;
};

// found on FCC, only used to validate redirect
const isValidUrl = function(urlString) {
  try {
    return Boolean(new URL(urlString));
  } catch (e) {
    return false;
  }
};

module.exports = { emailFinder, generateRandomString, urlsForUser, isValidUrl };