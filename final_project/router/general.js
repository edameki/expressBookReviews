const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();



// Get the book list available in the shop
public_users.get('/',function (req, res) {
  let bookPromise = new Promise((resolve,reject) => {
    resolve(books);
  });
  
  bookPromise.then( (matchingBooks) => {
    res.send({ 
      book: matchingBooks 
    });
  });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

  let bookPromise = new Promise((resolve,reject) => {
    const matches = Object.values(books).filter((book, index) => {
      return (index+1).toString() === isbn;
    });

    if (matches.length > 0)
      resolve(matches[0]);
    else
      reject(`Could not find book with ISBN ${isbn}`);
  });

  bookPromise.catch( (err) => {
    res.status(404).json(err)
  }).then( (book) => {
    res.send({ 
      book: book
    });
  });
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;

  let bookPromise = new Promise((resolve,reject) => {
    const matches = Object.values(books).filter((book) => {
      return book.author.includes(author);
    });

    resolve(matches);
  });

  bookPromise.then( (matches) => {
    res.send({ 
      booksByAuthor: matches
    });
  });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;

  let bookPromise = new Promise((resolve,reject) => {
    const matches = Object.values(books).filter((book) => {
      return book.title.includes(title);
    });

    resolve(matches);
  });

  bookPromise.then( (matches) => {
    res.send({ 
      booksByTitle: matches
    });
  });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

  const matchingBooks = Object.values(books).filter((book, index) => {
    return (index+1).toString() === isbn;
  })

  let review = {};
  if (matchingBooks && matchingBooks[0].reviews) 
  {
    const reviews = Object.values(matchingBooks[0].reviews);
    if (reviews)
    {
      review = reviews[Math.floor(Math.random() * reviews.length)]
    }
  }

  return res.send({review: review});
});

public_users.post("/register", (req,res) => {
  //Write your code here
  //
  
  const username = req.body.username;
  const password = req.body.password;

  console.log(req.body)
  console.log(username)
  console.log(password)
  
  if (username && password) {
    if (!isValid(username)) {
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }

  return res.status(404).json({message: "Unable to register user."});
});

module.exports.general = public_users;
