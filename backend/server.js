const PORT = 5000;

// Configuring dotenv file
// const dotenv = require('dotenv')
// dotenv.config();
const cors = require('cors');
const express = require('express')

// Importing Sequelize models 
const { db, Participants, Interviews } = require('./models/db')

// // setting up bcrypt
// const bcrypt = require('bcrypt');
// const saltRounds = 10;

// // setting up nodemailer
// const nodemailer = require('nodemailer');
// // Details of account seding mails
// var smtpTransport = nodemailer.createTransport({
//     service: "gmail",
//     host: "smtp.gmail.com",
//     auth: {
//         user: process.env.NODEMAILER_EMAIL,
//         pass: process.env.NODEMAILER_PASS
//     }
// });

const app = express()

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => res.send("hi i am host"));

// Dummy Data Insertion Fn
function addDumyData() {
    let data = [
        {
            "name": "Manav",
            "email": "zmanav.1999@gmail.com",
        },
        {
            "name": "Ayush",
            "email": "an431@gmail.com",
        },
        {
            "name": "Sachin",
            "email": "sac.9798@gmail.com",
        },
        {
            "name": "Akshara",
            "email": "ak47.12@gmail.com",
        },
        {
            "name": "Siddharth",
            "email": "siddhi15798@gmail.com",
        },
    ]
    data.forEach((user) => {
        Participants.create(user).then(user => {
            console.log("User added ---->>>> ", user);
        })
    })
}

setTimeout(() => {
    addDumyData();
}, 500);


app.get('/participants', (req, res) => {
    Participants.findAll()
        .then((users) => res.json(users))

});

app.get('/interviews', function (req, res) {
})


app.post('/interviews', function (req, res) {
    console.log("Request : ", req);
})



db.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Server started on http://localhost:${PORT}`);
    })
})

