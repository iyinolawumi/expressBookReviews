// const express = require('express');
// const jwt = require('jsonwebtoken');
// let books = require("./booksdb.js");
// const regd_users = express.Router();

// let users = [];

// const isValid = (username)=>{ //returns boolean
// //write code to check is the username is valid
// }

// const authenticatedUser = (username,password)=>{ //returns boolean
// //write code to check if username and password match the one we have in records.
// }

// //only registered users can login
// regd_users.post("/login", (req,res) => {
//   //Write your code here
//   return res.status(300).json({message: "Yet to be implemented"});
// });

// // Add a book review
// regd_users.put("/auth/review/:isbn", (req, res) => {
//   //Write your code here
//   return res.status(300).json({message: "Yet to be implemented"});
// });

// module.exports.authenticated = regd_users;
// module.exports.isValid = isValid;
// module.exports.users = users;



const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

// Users array to store registered users
let users = [];

// Check if username is valid (exists)
const isValid = (username) => {
    return users.some(user => user.username === username);
}

// Check if username & password match
const authenticatedUser = (username, password) => {
    return users.some(user => user.username === username && user.password === password);
}

// Task 7: Login route for registered users
regd_users.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    if (authenticatedUser(username, password)) {
        // Create JWT token
        const accessToken = jwt.sign({ username: username }, 'access', { expiresIn: '1h' });

        // Save token in session
        req.session.authorization = { accessToken };

        return res.status(200).json({ message: "User successfully logged in", token: accessToken });
    } else {
        return res.status(401).json({ message: "Invalid username or password" });
    }
});

// Task 8: Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.user.username; // from JWT middleware

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    if (!books[isbn].reviews) {
        books[isbn].reviews = {};
    }

    // Add or update review by username
    books[isbn].reviews[username] = review;

    return res.status(200).json({ message: "Review added/updated successfully", reviews: books[isbn].reviews });
});

// Task 9: Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.user.username; // from JWT middleware

    if (!books[isbn] || !books[isbn].reviews || !books[isbn].reviews[username]) {
        return res.status(404).json({ message: "Review not found for this user" });
    }

    // Delete the review for the current user
    delete books[isbn].reviews[username];

    return res.status(200).json({ message: "Review deleted successfully", reviews: books[isbn].reviews });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
