const express = require('express');
const axios = require('axios').default;
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (isValid(username)) {
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "User successfully registred. Now you can login" });
        } else {
            return res.status(404).json({ message: "User already exists!" });
        }
    }

    return res.status(404).json({ message: "Missing username or password" });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    return res.json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book) {
        return res.json(book);
    } else {
        return res.status(404).json({ message: 'Book not found for isbn ' + isbn });
    }
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    const booksByAuthor = [];
    for (const key in books) {
        if (books[key].author === author) {
            booksByAuthor.push(books[key]);
        }
    }
    if (booksByAuthor.length > 0) {
        return res.json(booksByAuthor);
    } else {
        return res.status(404).json({ message: 'No books found for author ' + author });
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    const booksByTitle = [];
    for (const key in books) {
        if (books[key].title === title) {
            booksByTitle.push(books[key]);
        }
    }
    if (booksByTitle.length > 0) {
        return res.json(booksByTitle);
    } else {
        return res.status(404).json({ message: 'No books found for title ' + title });
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book) {
        return res.json(book['reviews']);
    } else {
        return res.status(404).json({ message: 'Book not found for isbn ' + isbn });
    }
});


module.exports.general = public_users;

//// Async/Promise based functions

const BASE_URL = 'http://localhost:5000';

async function getAllBooks() {
    const result = await axios.get(BASE_URL + '/');
    return result.data;
}

async function getBookByIsbn(isbn) {
    const result = await axios.get(BASE_URL + '/isbn/' + isbn);
    return result.data;
}

async function getBookByAuthor(author) {
    const result = await axios.get(BASE_URL + '/author/' + author);
    return result.data;
}

async function getBookByTitle(title) {
    const result = await axios.get(BASE_URL + '/title/' + title);
    return result.data;
}
