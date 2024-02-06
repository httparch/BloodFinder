//server config
const express = require('express');
const path = require('path');
const mysql = require("mysql");
const dotenv = require('dotenv');

dotenv.config({path:'./.env'})

const app = express();

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

const publicDirectory = path.join(__dirname, './public') //directory for js / css

app.use(express.static(publicDirectory));

app.use(express.urlencoded({ extended: false})); //parse URL-encoded bodies (as sent by html forms)

app.use(express.json());//parse json bodies (as sent by API clients)

app.set('view engine', 'hbs');

db.connect( (error) => {
    if(error) {
        console.log(error)
    }else{
        console.log("MYSQL Connected...")
    }
})


//define routes
app.use('/', require('./routes/pages')) //checks route folder
app.use('/auth', require('./routes/auth')) //redirects to the auth file

app.listen(3003, () => {
    console.log("Server started on port 3003")
})