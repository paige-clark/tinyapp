### user registration form

On branch: feature/user-registration

* create an .ejs template for registration page
  * should have email field
  * should have password field
  * both should POST to /register

* create a GET route to display the page
  * if you try submit the form rn you'll get a 404 since there's no POST /register route yet

# DONE

### create registration functionality

* we'll want to be able to find and add users in our database
  * since the database is an object we'll probably have to loop through it with a for in loop

* create a users object DONE

* create a POST endpoint for the login page
  * this POST should add the login data to our object
  *