const express = require('express');

const router = express.Router();

router.get('/', (req , res) => {
    res.render('index');
});

router.get('/login', (req , res) => {
    res.render('login');
});

router.get('/register', (req , res) => {
    res.render('register') ;
});

router.get('/listofdonors', (req , res) => {
    res.render('listofdonors'
    
    );
});

router.get('/Aboutus', (req , res) => {
    res.render('Aboutus');
});


router.get('/contact', (req , res) => {
    res.render('contact');
});



module.exports = router;