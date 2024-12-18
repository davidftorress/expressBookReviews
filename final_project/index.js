const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();
const booksdbServer = express();

app.use(express.json());

app.use("/",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))
// Middleware to authenticate requests to "/customer/auth/*" endpoint
app.use("/customer/auth/*", function auth(req,res,next){
// Check if user is logged in and has valid access token
    if (req.session.authorization) {
        let token = req.session.authorization['accessToken'];
        // Verify JWT token
        jwt.verify(token, "access", (err, user) => {
            if (!err) {
                req.user = user;
                next(); // Proceed to the next middleware
            } else {
                return res.status(403).json({ message: "User not authenticated" });
            }
        });
    } else {
        return res.status(403).json({ message: "User not logged in" });
    }
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);
app.listen(PORT,()=>console.log("Server is running"));

// Servidor adicional para booksdb.js
const fs = require('fs');
const path = require('path');

booksdbServer.get('/booksdb', (req, res) => {
    const filePath= path.join(__dirname,'router','booksdb.json')
    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            res.status(500).send('Error al leer el archivo');
        } else {
            res.send(data);
        }
    });
});
const BOOKS_PORT = 3000;
booksdbServer.listen(BOOKS_PORT, () => console.log(`Books server is running on port ${BOOKS_PORT}`));