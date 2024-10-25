const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let authenticatedUser = require("./auth_users.js").authenticatedUser;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!isValid(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "User Name or password missing. Unable to register user."});
  
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
});
//only registered users can login
public_users.post("/login", (req,res) => {
    
    const username = req.body.username;
    const password = req.body.password;
    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }
    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });
        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
  
    //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  // Send JSON response with formatted friends data
    res.send(JSON.stringify(books,null,4));
    //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
});

public_users.get('/user',function (req, res) {
  // Send JSON response with formatted friends data
    res.send(JSON.stringify(users,null,4));
    //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    // Retrieve the isbn parameter from the request URL and send the corresponding books details
    const isbn = req.params.isbn;
    res.send(JSON.stringify(books[isbn],null,4));
    //Write your code here
    //return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    const booksByAuthor = Object.values(books).filter(book => book.author.toLowerCase() === author.toLowerCase());

    if (booksByAuthor.length > 0) {
        res.send(JSON.stringify(booksByAuthor,null,4));
    } else {
        res.status(404).send('No books found by this author');
    }
//Write your code here
    //return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    const booksByTitle = Object.values(books).filter(book => book.title.toLowerCase() === title.toLowerCase());

    if (booksByTitle.length > 0) {
        res.send(JSON.stringify(booksByTitle,null,4));
    } else {
        res.status(404).send('No books found by this title');
    }
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]&&books[isbn].reviews){
        res.json(books[isbn].reviews);
    }else{
        res.status(404).send('No reviews available for this book');
    }
    
    //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
