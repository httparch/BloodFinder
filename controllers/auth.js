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

    db.query('SELECT * FROM blooddonor WHERE email = ?', [email], async (error, results) => {
        if (error) {
            console.log(error);
            return res.render('login', {
                message: 'Something went wrong.'
            });
        }

        if (results.length === 0) {
            return res.render('login', {
                message: 'Email not found.'
            });
        }

        const user = results[0];
        const isValidPassword = await bcrypt.compare(password, user.password);

        if (isValidPassword) {
            return res.render('login', {
                message: 'Successfully logged in.'
            });
        } else {
            return res.render('login', {
                message: 'Wrong credentials.'
            });
        }
    });
};

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