const axios = require("axios");
const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
// TO REGISTER A NEW USER
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // FIX: check using array find()
  if (users.find(u => u.username === username)) {
    return res.status(400).json({ message: "Username already exists" });
  }

  users.push({ username, password });
  return res.status(200).json({ message: "User registered successfully" });
});


  // return res.status(300).json({message: "Yet to be implemented"});


// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  // Return all books as a neatly formatted JSON string
  return res.status(200).send(JSON.stringify(books, null, 2));
});

 // return res.status(300).json({message: "Yet to be implemented"});


// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  
  // Get book details based on ISBN
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).send(JSON.stringify(books[isbn], null, 2));
  }

  return res.status(404).json({ message: "Book not found" });
});

  
  // return res.status(300).json({message: "Yet to be implemented"});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here

  // Get book details based on author
  const author = req.params.author;
  const bookKeys = Object.keys(books);
  let result = [];

  bookKeys.forEach((key) => {
    if (books[key].author === author) {
      result.push(books[key]);
    }
  });

  if (result.length > 0) {
    return res.status(200).send(JSON.stringify(result, null, 2));
  }

  return res.status(404).json({ message: "No books found for this author" });



// return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here

  // Get all books based on title
  const title = req.params.title;
  const bookKeys = Object.keys(books);
  let result = [];

  bookKeys.forEach((key) => {
    if (books[key].title === title) {
      result.push(books[key]);
    }
  });

  if (result.length > 0) {
    return res.status(200).send(JSON.stringify(result, null, 2));
  }

  return res.status(404).json({ message: "No books found with this title" });


  // return res.status(300).json({message: "Yet to be implemented"});
});


//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here

  // Get book review
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  }

  return res.status(404).json({ message: "Book not found" });

  // return res.status(300).json({message: "Yet to be implemented"});
});


// Task 10: Get book list using async-await + Axios
public_users.get('/async/books', async (req, res) => {
  try {
    const response = await axios.get("http://localhost:5000/");
    return res.status(200).json(response.data);
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch books" });
  }
});


// Task 11: Get book details by ISBN using async-await + Axios
public_users.get('/async/isbn/:isbn', async (req, res) => {
  try {
    const isbn = req.params.isbn;
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    return res.status(200).json(response.data);
  } catch (err) {
    return res.status(404).json({ error: "Book not found" });
  }
});


// Task 12: Get book details by Author using async-await + Axios
public_users.get('/async/author/:author', async (req, res) => {
  try {
    const author = req.params.author;
    const response = await axios.get(`http://localhost:5000/author/${author}`);
    return res.status(200).json(response.data);
  } catch (err) {
    return res.status(404).json({ error: "Author not found" });
  }
});


// Task 13: Get books by Title using async-await + Axios
public_users.get('/async/title/:title', async (req, res) => {
  try {
    const title = req.params.title;
    const response = await axios.get(`http://localhost:5000/title/${title}`);
    return res.status(200).json(response.data);
  } catch (err) {
    return res.status(404).json({ error: "Title not found" });
  }
});



module.exports.general = public_users;