# backend-dev-nodejs-grimoire
This project showcases proficiency with the development of a backend API for “Mon Vieux Grimoire,” a book rating website. Built with Node.js, Express, and MongoDB, it provides secure user authentication, book and ratings management, optimized image uploads with Sharp, and follows MVC architecture and Green Code best practices.
# Mon Vieux Grimoire - Backend API
# Project Overview
This repository contains the backend API for “Mon Vieux Grimoire,” a book rating website.
Built with Node.js, Express, and MongoDB, it provides:

Secure user authentication using JWT
CRUD operations for books and ratings
Image upload and optimization with Multer and Sharp
Calculation and storage of average book ratings
Compliance with MVC architecture and Green Code best practices

# Environment Setup
This project uses environment variables for sensitive configuration.
Please follow these steps to set it up locally (Ensure that you have dotenv installed, if not run: npm i dotenv ):
  1) Copy the example environment file:
      cp .env.example .env
  2) Edit .env and fill in your own values for:
      MONGO_NODE_ENV: Your node environment should be set to 'public'
      MONGO_SRV or MONGO_URI_PUB: Your MongoDB connection string
      JWT_CIPHER: The secret key to sign JWT tokens (randomized)
      PORT: (Optional) Port number for the server (defaults to 3000, Expected Port number 4000)
Important: Do not commit your .env file to version control.

# Installation
1) If needed, clone the repository:
  git clone https://github.com/EAE00-src/backend-dev-nodejs-grimoire.git
2) Navigate into the project folder if you aren't already inside of it:
  cd backend-dev-nodejs-grimoire
3) Navigate into the Backend folder:
   cd Backend
5) Install dependencies:
  npm install
  (You may run into installation issue/errors due to version compatibility between various packages, use --force(can break project) or --legacy-peer-deps(ignores the potential compatibility issues without breaking packages) as instructed)
  (Optional: Nodemon was used during development of this project but not listed as a dependency, to install this package run: npm i nodemon)
7) Navigate back into the Frontend folder:
  cd ..
  cd Frontend
8) Install dependencies once more:
  npm install

# Usage
1) Start the server (Inside of Backend folder):
  (Nodemon):  nodedemon server
  (Nodejs): node server
2) Start the React App (Inside of Frontend folder):
     npm run start
3) The API will be accessible at http://localhost:4000 (or your specified port (be sure to modify the relevant files within Frontend accordingly)).

Available endpoints include:
'/api/auth/signup' or '/api/auth/login': User registration and/or login
'/api/books/': CRUD for Books (use '/:id' for specific resources)
'/api/books/bestrating': Get the Top 3 highest rated books
'/api/books/:id/rating': Submit a rating for a book

# Project Structure
  /controllers/: Route handler logic
  /models/: Mongoose schemas
  /middleware/: Authenthication, image processing, and other middleware
  /routes/: API route declarations
  /images/: Local storage for images
  
