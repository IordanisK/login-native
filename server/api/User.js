const express = require('express');
const router = express.Router();

//mongodb user model 
const User = require('./../models/User');

//Password handler
const bcrypt = require('bcrypt');

//Signup
router.post('/signup', (req, res) => {
    let {name, email, password, dateOfBirth} = req.body;
    name = name.trim();
    email = email.trim();
    password = password.trim();
    dateOfBirth = dateOfBirth.trim();

    if (name == ""  || email == "" || password == "" || dateOfBirth == "") {
        res.json({
            status: "FAILED",
            message: "Empty input field!"
        });
    } else if (!/^[a-zA-Z ]*$/.test(name)) { // "!/^[a-zA-Z ]*$/" = regular expression test for name.
        res.json({
            status: "FAILED",
            message: "Invalid name entered"
        })
    } else if ( /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) { //  /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/ = regular expression test for email.
        res.json({
            status: "FAILED",
            message: "Invalid email entered"
        })
    } else if (!new Date(dateOfBirth).getTime()) { // validering for datum.
        res.json({
            status: "FAILED",
            message: "Invalid date of birth entered"
        })
    } else if (password.length < 8) {
        res.json({
            status: "FAILED",
            message: "Password is too short."
        })
    } else {
        //Checking if user already exists 
        User.find({email}).then(result => {
            if (result.length) {
                // User with this email already exists
                res.json({
                    status: "FAILED",
                    message: "A user with this email already exists"
                })
            } else {
                // Try to create new User

                //password handling
                const saltRounds = 10;
                bcrypt.hash(password, saltRounds).then(hashedPassword => {
                    const newUser = new User ({
                        name,
                        email,
                        password: hashedPassword,
                        dateOfBirth
                    });

                    newUser.save().then(result => {
                        res.json({
                            status: "SUCCESS",
                            message: "Signup successfull",
                            data: result,
                        })
                    })
                    .catch(err => {
                        console.log(err);
                        res.json({
                            status: "FAILED",
                            message: "An error occured while saving user!"
                        })
                    })
                })
                .catch(err => {
                    console.log(err);
                    res.json({
                        status: "FAILED",
                        message: "An error occured while hashing password!"
                    })
                })

            }
        }).catch(err => {
            console.log(err);
            res.json({
                status: "FAILED",
                message: "An error occured while checking for existing user!"
            })
        })
    }
})

//Signin
router.post('/signin', (req, res) => {
    let { email, password } = req.body;
    email = email.trim();
    password = password.trim();

    if ( email == "" || password == "" ) {
        res.json({
            status: "FAILED",
            message: "Empty credentials supplied"
        })
    } else {
        User.find({email})
        .then(data => {
            if (data.length) {
                //User exists

                const hashedPassword = data[0].password;
                bcrypt.compare(password, hashedPassword).then(result => {
                    if (result) {
                        //Password match
                        res.json({
                            status: "SUCCESS",
                            message: "Signin successfull",
                            data: data 
                        })
                    } else {
                        res.json({
                            status: "FAILED",
                            message: "Invalid password entered"
                        })
                    }
                })
                .catch(err => {
                    res.json({
                        status: "FAILED",
                        message: "An error occured while comparing passwords"
                    })
                })
            } else {
                res.json({
                    status: "FAILED",
                    message: "Invalid credentials entered"
                })
            }
        })
        .catch(err => {
            res.json({
                status: "FAILED",
                message: "An error occured while checking for existing user"
            })
        })
    }

})

module.exports = router;