const express = require('express');
const mysql = require("mysql");
const router = express.Router();

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

router.get('/', (req , res) => {

    var donor = [];
    let donorStats;

    db.query('SELECT email FROM blooddonor WHERE isloggedin = 1', async (error, results) => {
        donor = results[0];
 
       if(donor){

        db.query('SELECT bloodGroup, COUNT(*) as tot FROM blooddonor GROUP BY bloodGroup', async (error, results) => {
            if (error) {
                // Handle error
                console.error(error);
                return res.status(500).send('Internal Server Error');
            }
    
            donorStats = results;
            // Render the page after both queries have finished
            console.log(donorStats);
            res.render('index', {
                username: donor.email,
                donorstatistics: donorStats
            });
            
        });

        }else{
            db.query('SELECT bloodGroup, COUNT(*) as tot FROM blooddonor GROUP BY bloodGroup', async (error, results) => {
                if (error) {
                    // Handle error
                    console.error(error);
                    return res.status(500).send('Internal Server Error');
                }
        
                donorStats = results;
                // Render the page after both queries have finished
                console.log(donorStats);
                res.render('index', {
                    donorstatistics: donorStats
                });
                
            });
        } 
    });
});

router.get('/login', (req , res) => {
    db.query('UPDATE blooddonor SET isloggedin = 0 WHERE isloggedin = 1;');
    res.render('login');
});

router.get('/register', (req , res) => {
    res.render('register') ;
});


router.get('/listofdonors', (req, res) => {

    const { bloodType, city, district, barangay} = req.query;
    let finder;
    let donor;
    let bloodDonors;
    let donorStats;
   
    db.query('SELECT phonenumber,bloodGroup, city, district ,barangay FROM blooddonor WHERE bloodGroup = ? AND city = ? AND district = ? AND barangay = ?',
    [bloodType,city,district,barangay], async (error, results) => {
        if(error){
            console.log(error);
        }
        finder = results;
        console.log(results);

    });

    // Query to get the logged in donor's email
    db.query('SELECT email FROM blooddonor WHERE isloggedin = 1', async (error, results) => {
        if (error) {
            // Handle error
            console.error(error);
            return res.status(500).send('Internal Server Error');
        }
        
        donor = results[0]; // Assuming only one donor is logged in

        // Query to get all blood donors
        
        db.query('SELECT phonenumber, bloodGroup, city, district, barangay FROM blooddonor LIMIT 9', async (error, results) => {
            if (error) {
                // Handle error
                console.error(error);
            }
            bloodDonors = results;
            // Render the page after both queries have finished
            db.query('SELECT bloodGroup, COUNT(*) as tot FROM blooddonor GROUP BY bloodGroup', async (error, results) => {
                if (error) {
                    // Handle error
                    console.error(error);
                }
            
                donorStats = results;
                
                console.log('finders', finder);
                // Render the page after both queries have finisheds
                res.render('listofdonors', {
                    username: donor ? donor.email : '',
                    donorstatistics: donorStats ?? [],
                    blooddonors: finder.length > 0  ? finder : bloodDonors
                });
              
            });
        });
             
    });

});

router.get('/Aboutus', (req , res) => { 
    res.render('Aboutus')
});


router.get('/contact', (req , res) => {
    res.render('contact') 
});

router.get('/myaccount', (req, res) =>{

    let user;
    db.query('SELECT * FROM blooddonor WHERE isloggedin = 1', async (error, results) =>{
        
        user = results[0];
        
        res.render('myaccount',{
            username: user.email,
            city: user.city,
            district: user.district,
            barangay: user.barangay,
        })
    })
});

module.exports = router;


