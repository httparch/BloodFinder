const mysql = require("mysql");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
// const { promisify } = require("util");

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

// exports.login = async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         if (!email || !password) {
//             return res.status(400).sendFile(__dirname + "/login.hbs", {
//                 message: "Please Provide an email and password"
//             })
//         }
//         db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
//             console.log(results);
//             if (!results || !await bcrypt.compare(password, results[0].password)) {
//                 res.status(401).sendFile(__dirname + '/login.hbs', {
//                     message: 'Email or Password is incorrect'
//                 })
//             } else {
//                 const id = results[0].id;

//                 const token = jwt.sign({ id }, process.env.JWT_SECRET, {
//                     expiresIn: process.env.JWT_EXPIRES_IN
//                 });

//                 console.log("the token is " + token);

//                 const cookieOptions = {
//                     expires: new Date(
//                         Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
//                     ),
//                     httpOnly: true
//                 }
//                 res.cookie('userSave', token, cookieOptions);
//                 res.status(200).redirect("/");
//             }
//         })
//     } catch (err) {
//         console.log(err);
//     }
// }

exports.login = (req, res) => {

    console.log(req.body);

    const { email, password } = req.body; //distructuring

    db.query('SELECT * FROM blooddonor WHERE email = ? AND password = ?', [email] [password], async (error, results) => {

        // var results = Object.values(JSON.parse(JSON.stringify(results)))

        // if(error){
        //     console.log(error);
        // }
    

        // if(results.length > 0){
        //     return res.render('login', {
        //         message: 'Successfully logged in.'
        //     })
        // } else if(password !== passwordConfirm){
        //     return res.render('login', {
        //         message: 'Wrong password!.'
        //     });
        // }


        if (!results || !await bcrypt.compare(password, results[0].password)) {
                            return res.render('login', {
                                message: 'Email or Password is incorrect'
                            })
        }else {
            const id = results[0].id;
        }

    });
    
}

exports.register = (req, res) => {
    console.log(req.body);

    const { email, password, passwordConfirm } = req.body; //distructuring

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
        
        db.query('INSERT INTO blooddonor SET ? ', {email: email , password: hashedPassword}, (error, results) =>
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

// exports.isLoggedIn = async (req, res, next) => {
//     if (req.cookies.userSave) {
//         try {
//             // 1. Verify the token
//             const decoded = await promisify(jwt.verify)(req.cookies.userSave,
//                 process.env.JWT_SECRET
//             );
//             console.log(decoded);

//             // 2. Check if the user still exist
//             db.query('SELECT * FROM users WHERE id = ?', [decoded.id], (err, results) => {
//                 console.log(results);
//                 if (!results) {
//                     return next();
//                 }
//                 req.user = results[0];
//                 return next();
//             });
//         } catch (err) {
//             console.log(err)
//             return next();
//         }
//     } else {
//         next();
//     }
// }

// exports.logout = (req, res) => {
//     res.cookie('userSave', 'logout', {
//         expires: new Date(Date.now() + 2 * 1000),
//         httpOnly: true
//     });
//     res.status(200).redirect("/");
// }