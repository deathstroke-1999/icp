const PORT = 5000;
const Sequelize = require('sequelize')
const Op = Sequelize.Op;

// Configuring dotenv file
const dotenv = require('dotenv')
dotenv.config();

const cors = require('cors');
const express = require('express')

// Importing Sequelize models 
const { db, Participants, Interviews } = require('./models/db')


// setting up nodemailer
const nodemailer = require('nodemailer');
// Details of account seding mails
var smtpTransport = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASS
    }
});

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

// setTimeout(() => {
//     addDumyData();
// }, 500);


app.get('/participants', (req, res) => {
    Participants.findAll()
        .then((users) => res.json(users))

});

app.get('/interviews', function (req, res) {

    let cDate = new Date();

    Interviews.findAll({
        where: {
            date: {
                [Op.gte]: cDate,
            }
        },
        // attributes: ['date', 'startTime', 'endTime'],
        order: [['date', 'ASC'], ['startTime', 'ASC'], ['endTime', 'ASC'], ['participantId', 'ASC']]
        // group: ['date', 'startTime', 'endTime']
    })
        .then((records) => {
            console.log("records : ", records);

            res.json(records);
        })

})


app.post('/interviews', function (req, res) {
    // console.log("Request : ", req);
    console.log("req.body => ", req.body);


    let date_INC = req.body.date;
    let startTime_INC = req.body.startTime;
    let endTime_INC = req.body.endTime;
    let lisOfparticipants = req.body.participants;
    // console.log("lisOfparticipants :", lisOfparticipants);

    if (lisOfparticipants.length < 2) {
        console.error("gen error");
        res.status(401).send({ message: 'Add atleast 2 particpants please!' });
    } else {
        console.log("Find Clashes -----------------------__>");
        let participantIdArray = lisOfparticipants.map((p) => p.id);
        // console.log("participantIdArray : ", participantIdArray);

        Interviews.findOne({
            where: {
                date: date_INC,
                [Op.or]: [{
                    [Op.and]: [{
                        endTime: {
                            [Op.gte]: endTime_INC
                        }
                    }, {
                        startTime: {
                            [Op.lte]: startTime_INC
                        }
                    }
                    ]
                }, {
                    [Op.and]: [{
                        endTime: {
                            [Op.gte]: endTime_INC
                        }
                    }, {
                        startTime: {
                            [Op.gte]: startTime_INC
                        }
                    }, {
                        startTime: {
                            [Op.lt]: endTime_INC
                        }
                    }
                    ]
                }, {
                    [Op.and]: [{
                        endTime: {
                            [Op.lte]: endTime_INC
                        }
                    }, {
                        startTime: {
                            [Op.lte]: startTime_INC
                        }
                    }, {
                        endTime: {
                            [Op.gt]: startTime_INC
                        }
                    }
                    ]
                }, {
                    [Op.and]: [{
                        startTime: {
                            [Op.gte]: startTime_INC
                        }
                    }, {
                        endTime: {
                            [Op.lte]: endTime_INC
                        }
                    }
                    ]
                }],
                participantId: {
                    [Op.in]: participantIdArray
                }
            }
        })
            .then(function (record) {
                if (record) {
                    // console.log("record : ", record);
                    // There is a CLASH
                    let clashingParticipantId = record.dataValues.participantId;
                    // console.log("clashingParticipantId : ", clashingParticipantId)

                    let msg = "Following Partipant have Clashing Interviews : ";
                    Participants.findByPk(clashingParticipantId)
                        .then((record) => {
                            console.log("Clashing Record : ", record);
                            msg = msg + record.dataValues.name + "(" + record.dataValues.email + ")";
                            console.error("gen error");
                            res.status(401).send({ message: msg });
                        })

                }
                else {
                    // record -> null
                    console.log("NO CLASH");
                    lisOfparticipants.forEach(function (oneParticipant) {
                        // console.log("oneParticipant : ", oneParticipant);
                        let newInterview = {
                            participantId: oneParticipant.id,
                            date: date_INC,
                            startTime: startTime_INC,
                            endTime: endTime_INC
                        }
                        Interviews.create(newInterview).then(intrvw => {
                            console.log("intrvw added ---->>>> ", intrvw);

                            console.log("RUN XXXXXXXXXXXXXX");
                            let participantEmail = oneParticipant.email;
                            // Sending a MAIL

                            let mailText = `Date : ${date_INC}, from ${startTime_INC} to ${endTime_INC}`;
                            var mailOptions = {
                                to: participantEmail,
                                subject: 'Interview Details.',
                                text: mailText
                            }
                            smtpTransport.sendMail(mailOptions, function (err, res) {
                                if (err) {
                                    console.log("Error : ", err)
                                }
                                else {
                                    console.log('Email sent: ' + res.response);
                                }
                            })

                        })
                    })
                    res.sendStatus(200);
                }
            })

    }
    console.log("Interview ADDED");

})


db.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Server started on http://localhost:${PORT}`);
    })
})
