const { RssFeed } = require("@mui/icons-material");

function Schedule(database){
    const express = require("express");
    const router=express.Router();

    //creating a new schedule
    router.post('/createSchedule', (req, res)=>{
        //console.log("create schedule called");
        if(Object.keys(req.body).length <3){
            res.send(null);
        }
        else{

            const userID=req.body.userID;
            const startDate=req.body.startDate;
            const endDate=req.body.endDate;
            database.createSchedule(userID, startDate, endDate, function(err, result){
                res.send(200);
            })
        }
    })

    //adding an item to the time table
    router.post('/timeTableEntry', (req, res)=>{
        console.log(req.body);
        if(Object.keys(req.body).length < 4){
            res.send(null);
        }
        else{
            const scheduleID= req.body.scheduleID;
            const day=req.body.day;
            const time=req.body.time;
            const desc=req.body.desc;

            database.timeTableEntry(scheduleID, day, time, desc, function(err, result){
                res.send("Success");
            })
        }
    })

    //changing timetable entry
    router.post('/changeTimeTableEntry', (req, res)=>{
        if(Object.keys(req.body).length < 4){
            res.send(null);
        }
        else{
            const scheduleID= req.body.scheduleID;
            const day=req.body.day;
            const time=req.body.time;
            const desc=req.body.desc;
            console.log(req.body);
            database.changeTimeTableEntry(scheduleID, day, time, desc, function(err, result){
                res.send("Success");
            });

        }
    })

    //get schedule id
    router.post('/getScheduleID', (req, res)=>{
        console.log("hello");
        if(Object.keys(req.body).length < 1){
            res.send(null);
        }
        else{
            const userID=req.body.userID;
            database.getScheduleID(userID, function(err, result){
                console.log(err);
                res.send(result);
            })
        }
    })

    //putting the new schedule into the notifications table
    router.post('/scheduleNotification', (req, res)=>{
        if(Object.keys(req.body).length <2){
            res.send(null);
        }
        else{
            const userID= req.body.userID;
            const scheduleID= req.body.scheduleID;
            database.scheduleNotification(userID, scheduleID, function(err, result){
                res.send(200);
            })
        }
    })

    //getting the information on the time table
    router.post('/getTimeTable', (req,res)=>{
        if(Object.keys(req.body).length <1){
            res.send(null);
        }
        else{
            const scheduleID=req.body.scheduleID;
            database.getTimeTable(scheduleID, function(err, result){
                res.send(result);
            })
        }
    })

    return router;
}

module.exports=Schedule;