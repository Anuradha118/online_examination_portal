# edAcademy, An Online Examination Portal.
https://morning-mesa-91973.herokuapp.com/

# Project Description
A Multiple choice test taking system in which tests are tracked live and analytics are
generated based on that.


# Features
1) User Management System -
    - User can signup using email,gmail and facebook.
    - User can signin to the system through email and password combination or using Gmail/Facebook.
    - Forgot password functionality should be there to reset password.
2) User Testing management system -
    - Once user signin to the system, he/she would see the dashboard displaying all the statistics like number of tests attempted, highest score, lowest score and average performance of all the tests attempted.
    - The bar chart showing average score of each attempted test.
    - The cart showing average percentage growth.
    - The user can see all the tests attempted by him/her by clicking on 'Attempted Test' button.
    - The user can see each test score.
    - The user can take a test by clicking on 'Take Test' button. User will be redirected to all the available tests in the system.
    - The user can start the test whichever he/she wants to by clicking 'Start Test' button.
3) User test taking system -
    - Once the user start the test he/she first see the instructions or rules of the test.
    - Once the user reads the instructions and accepts the rules by clicking on 'Accept and Continue', the test timer will start displaying the question and its options.
    - User can able to select only one option from all options.
    - The test will have time limit, and the test get submitted automatically once the timeout occurs.
    - User can submit the test before time if they want to.But they will be alerted for confirmation to submit.
    - The system keep track of how much time user take to answer each question.
    - Once the user submit the test, score and average percentage is calculated and displayed to the user.
4) Test listing Admin-
    - For admin access to the system one should signup with the 'admin@edacademy.com' email address.
    - Admin can create test in the system.
    - Each test have a set of questions, each question containing at least 4 options and overall time limit of the test.
    - Admin can to create, edit, delete and view any tests, question or option.
    - Admin can set the correct answer while create options for any questions.
5) User analytics in admin-
    - Admin can view details of users registered in the system.
    - Admin can view overall performance of the user in all his/her tests.
    
# Additional Features
 - Admin can view all attempted tests and their statistics.
 - User can view bar chart(using Chart js) containing their average performance score in each tests.
 - The user is authenticated using JWT. Default JWT expiry time is set to 30 minutes.
 - Otp is send to usesr to reset their password using 'sendotp' package and MSG91 service.

# Pre-Requisites
  - Node.js should be installed.
  - MongoDB should be installed.
  - NPM should be installed.
  - Sendgrid Username and Password should be there.
  - MSG91 Authkey should be there.
  - Facebook and Google client id and secret should be there to enable signin option with facebook and google.
  
# App Installation
  - Setting up local server
      First run the local mongodb server, then add config.json inside server->configs with all the environment variables like 
      PORT, JWT_SECRET,MONGODB_URI,MSG91_AUTHKEY,FB_CLIENT_ID,FB_CLIENT_SECRET,FB_CALLBACK_URL,GOOGLE_CLIENT_ID,GOOGLE_CLIENT_SECRET,GOOGLE_CALLBACK_URL,
      SENDGRID_USER and SENDGRID_SECRET to send emails.

  - Download the code from github.
  - Unzip the folder
  - Open command prompt from the unzipped folder
  - Run command: npm install to install all the packages
  - Run command: node server/server.js
  - The local server will start with the mentioned port
  
# How to use the app
  - Visit http://localhost:{{PORT}} on your browser
  - Click on the SignIn tab present at the top right corner.
  - Click on the SignUp option, to create an account in the system.
  - Once you sucessfully register, login to the system with correct credentials.

# Developed with:
  - MongoDB
  - ExpressJS
  - AngularJS
  - NodeJS
  
# Developed By:
  Anuradha Sahoo
