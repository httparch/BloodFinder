const mysql = require("mysql");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

exports.login = (req, res) => {
    console.log(req.body);

    const { email, password } = req.body;
    db.query('UPDATE blooddonor SET isloggedin = 0 WHERE isloggedin = 1');
    db.query('SELECT * FROM blooddonor WHERE email = ?', [email], async (error, results) => {
        if (error) {
            return res.render('login', {
                message: 'Something went wrong.'
            });
        }

        if (results.length === 0) {
            return res.render('login', {
                message: 'Email not found.'
            });
        }
        // console.log("result",results)
        const user = results[0];
        const isValidPassword = await bcrypt.compare(password, user.password);

        if (isValidPassword) {
            //update creds is_login = 1
            db.query('UPDATE blooddonor SET isloggedin = 1 WHERE email = ?', [user.email]);
          
        //    const donor_stats = db.query('SELECT * FROM blooddonor WHERE email = ?', [user.email]);

        //    console.log("here",donor_stats,donor_stats[0]);
            console.log(user.bloodGroup);

            return res.render('index', {
                username: user.email,
                myaccount: 'My Account',
                message: 'Successfully logged in.',
                // donor_stats_data:donor_stats
            });
        } else {
            return res.render('login', {
                message: 'Wrong password.'
            });
        }
    });
};

exports.register = (req, res) => {
    console.log(req.body);

    const { email, password, passwordConfirm, BloodType, city, district, barangay, phonenumber, isloggedin } = req.body; //distructuring

    db.query('SELECT email FROM blooddonor WHERE email = ?', [email], async (error, results) => {

        // var results = Object.values(JSON.parse(JSON.stringify(results)))

        if(error){
            console.log(error);
        }

        if(results.length > 0){
            return res.render('register', {
                message: 'That email is already in use.'
            })
        } else if(password !== passwordConfirm){
            return res.render('register', {
                message: 'Passwords do not match.'
            });
        }

        let hashedPassword = await bcrypt.hash(password, 8);

        console.log(hashedPassword);
        
        db.query('INSERT INTO blooddonor SET ? ', {email: email , password: hashedPassword, bloodGroup: BloodType, city: city, district: district, barangay: barangay, phonenumber: phonenumber}, (error, results) =>
        {
            if(error){
                console.log(error);
            }else{
                console.log(results);
                return res.render('register', {
                    message: 'User registered'
                });
                
            }
            
        })
    });
}
//SELECT phonenumber,bloodGroup, city, district ,barangay FROM blooddonor WHERE city = ? AND district = ? AND barangay = ?
exports.find = (req, res) => {

    const { bloodType, city, district, barangay} = req.query;
    console.log('value', req.query);
    let finder;

    db.query('SELECT phonenumber,bloodGroup, city, district ,barangay FROM blooddonor WHERE bloodGroup = ? AND city = ? AND district = ? AND barangay = ?',[bloodType,city,district,barangay], async (error, results) => {
        if(error){
            console.log(error);
        }

        finder = results;
        console.log(results);

        if(results.length > 0){
            return res.render('listofdonors', {
                blooddonors: finder
            });
        }
        // } else if(password !== passwordConfirm){
        //     return res.render('register', {
        //         message: 'Passwords do not match.'
        //     });
        // }

    })

}
