const express = require('express');
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
// Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
// Filter the users array for any user with the same username and password
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const {review}= req.body;
    const username = req.session.authorization.username; 
    if (books[isbn]){
        if (!books[isbn].reviews){
           books[isbn].reviews={};
        }else{
           books[isbn].reviews[username]=review;
           res.status(300).json({ message: 'review updapted', reviews: books[isbn].reviews });
        }
   }else{
       res.status(404).send('Book not found');
   }
    //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
});
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;
   
        if (books[isbn]&& books[isbn].reviews&&books[isbn].reviews[username] ){
            delete books[isbn].reviews[username];
            res.status(300).send('Review Deleted');
        }else{
           res.status(404).send('No reviews available te delete to '+username+ ' for this book'); 
        }
   
    
    

});
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.authenticatedUser = authenticatedUser;
module.exports.users = users;
