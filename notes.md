## GET /
if user is logged in:
(Minor) redirect to /urls
**DONE**

if user is not logged in:
(Minor) redirect to /login
**KINDA DONE:** shows a welcome page, I think it looks nice


## GET /urls
if user is logged in:
  * returns HTML with:
    * the site header (see Display Requirements above) **DONE**
    * a list (or table) of URLs the user has created, each list item containing:
      * a short URL **DONE**
      * the short URL's matching long URL **DONE**
      * an edit button which makes a GET request to /urls/:id **DONE**
      * a delete button which makes a POST request to /urls/:id/delete **DONE**
      * **(Stretch)** the date the short URL was created **NOT DONE/STRETCH**
      * **(Stretch)** the number of times the short URL was visited **NOT DONE/STRETCH**
      * **(Stretch)** the number number of unique visits for the short URL **NOT DONE/STRETCH**
    * (Minor) a link to "Create a New Short Link" which makes a GET request to /urls/new **DONE**
**DONE**

if user is not logged in:
  * returns HTML with a relevant error message
**KINDA DONE:** shows a welcome page, I think it looks nice


## GET /urls/new
if user is logged in:
  * returns HTML with:
    * the site header (see Display Requirements above) **DONE**
    * a form which contains:
      * a text input field for the original (long) URL **DONE**
      * a submit button which makes a POST request to /urls **DONE**

if user is not logged in:
  * redirects to the /login page **DONE**


## GET /urls/:id
if user is logged in and owns the URL for the given ID:
  * returns HTML with:
    * the site header (see Display Requirements above) **DONE**
    * the short URL (for the given ID) **DONE**
    * a form which contains:
      * the corresponding long URL **??? DONE I THINK**
      * an update button which makes a POST request to /urls/:id **DONE**
    * (Stretch) the date the short URL was created **NOT DONE/STRETCH**
    * (Stretch) the number of times the short URL was visited **NOT DONE/STRETCH**
    * (Stretch) the number of unique visits for the short URL **NOT DONE/STRETCH**

if a URL for the given ID does not exist:
  * (Minor) returns HTML with a relevant error message **DONE**

if user is not logged in:
  * returns HTML with a relevant error message **DONE**

if user is logged in but does not own the URL with the given ID: **DONE**
  * returns HTML with a relevant error message


## GET /u/:id
if URL for the given ID exists:
  * redirects to the corresponding long URL **DONE**

if URL for the given ID does not exist:
  * (Minor) returns HTML with a relevant error message **DONE**


## POST /urls
if user is logged in:
  * generates a short URL, saves it, and associates it with the user **DONE**
  * redirects to /urls/:id, where :id matches the ID of the newly saved URL **DONE**

if user is not logged in:
  * (Minor) returns HTML with a relevant error message **DONE**


## POST /urls/:id
if user is logged in and owns the URL for the given ID:
  * updates the URL **DONE**
  * redirects to /urls **DONE**

if user is not logged in:
  * (Minor) returns HTML with a relevant error message **DONE**

if user is logged it but does not own the URL for the given ID:
  * (Minor) returns HTML with a relevant error message **DONE**


## POST /urls/:id/delete
if user is logged in and owns the URL for the given ID:
  * deletes the URL **DONE**
  * redirects to /urls **DONE**

if user is not logged in:
  * (Minor) returns HTML with a relevant error message **DONE**

if user is logged in but does not own the URL for the given ID:
  * (Minor) returns HTML with a relevant error message **DONE**


## GET /login
if user is logged in:
  * (Minor) redirects to /urls **DONE**

if user is not logged in:
  * returns HTML with a form which contains::
    * input fields for email and password **DONE**
    * submit button that makes a POST request to /login **DONE**


## GET /register
if user is logged in:
  * (Minor) redirects to /urls **DONE**

if user is not logged in:
  * returns HTML with a form which contains:
    * input fields for email and password **DONE**
    * a register button that makes a POST request to /register **DONE**

## POST /login
if email and password params match an existing user:
  * sets a cookie **DONE**
  * redirects to /urls **DONE**

if email and password params don't match an existing user:
  * returns HTML with a relevant error message **DONE**

## POST /register
if email or password are empty:
  * returns HTML with a relevant error message **DONE**

if email already exists:
  * returns HTML with a relevant error message **DONE**

otherwise:
  * creates a new user **DONE**
  * encrypts the new user's password with bcrypt **DONE**
  * sets a cookie **DONE**
  * redirects to /urls **DONE**


## POST /logout
deletes cookie **DONE**
redirects to /urls **DONE**

## Additional Requirements
Site Header:

if a user is logged in, the header shows:
* the user's email
* a logout button which makes a POST request to /logout
**DONE**

if a user is not logged in, the header shows:
* a link to the login page (/login)
* a link to the registration page (/register)
**DONE**