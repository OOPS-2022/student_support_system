require("dotenv").config()
const { workerData } = require("worker_threads");
const nodemailer = require("nodemailer")
const database = require('../sqlDatabase/database.js');

async function main() {
    console.log(workerData.description);

    //Transporter configuration
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "sdteamoops@gmail.com",
            pass: "itfwabyrkopdiqfp",
        },
        tls: {
            rejectUnauthorised: false,
        },
    });

    database.getEmails(function (err, result) {
        const emails = result;
        //Email configuration
        transporter.sendMail({
            from: "sdteamoops@gmail.com",
            to: result, //MULTIPLE RECEIVERS
            subject: "Daily Schedule Reminder", //EMAIL SUBJECT
            text: "This is your daily reminder to head over to Wits Support System and check out your daily schedule.\nGood luck!", //EMAIL BODY IN TEXT FORMAT
        })
    })



}

main().catch(err => console.log(err));