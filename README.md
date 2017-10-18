# Voting Application

## Project Overview
This application is a full stack JavaScript voting app that let the users create their account and create their own polls. The application uses PassportJS to authenticate the users when they sign up an account and perform login session.

The logic of the application is described below:

**As an authenticated user**
- The user can keep the user's polls and come back later to access them.
- The user can share the user's polls with the user's friends
- The user can see the aggregate results of the user's polls.
- The user can delete polls that the user does not want anymore.
- The user can create a poll with any number of possible items.
- The user can vote on everyone's polls.
- The user can see the results of polls in chart form.

**As an unauthenticated user**
- The user can vote on everyone's polls.
- The user can see the results of polls in chart form.

## How I built this application?
The application is divided into 3 parts:
  1. Backend:
      - **bcrypt** : hash user's password when signing up and compare hashed password
      - **body-parser**: parse the input fields from forms
      - **connect-flash** : raise error messages when errors occur
      - **cookie-parser** : parse cookie
      - **ejs** : view engine
      - **express** : control routes
      - **express-session** : session
      - **helmet** : secure express app by setting various HTTP header
      - **mongoose** : database (User && Poll)
      - **morgan**: HTTP request logger middleware
      - **passport**: Authentication
      - **passport-local** Authentication for Local Strategy
  2. Frontend:
      - **Bootstrap**
  3. Data Visualization
      - **Google Chart**









 



