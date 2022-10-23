function createSchedule(userID, startDate, endDate, callback, db){
    const sqlQuery="Insert into schedule (user_id, start_date, end_date) values (?, ?,?)"; //important date format YYYY-MM-DD
    db.query(sqlQuery, [userID, startDate, endDate], (err, result)=>{
        if(err!=null){
            console.log(err);
        }
        else{
            callback(null, "success");
        }
    })
}

function timeTableEntry(scheduleID, day, time, desc, callback, db){
    const sqlQuery="Insert into time_table (schedule_id, weekday, time, details) values (?, ?, ?,?)";
    db.query(sqlQuery, [scheduleID, day, time, desc], (err, result)=>{
        if(err!=null){
            console.log(err);
        }
        else{
            callback(null, "success");
        }
    })
}

function changeTimeTableEntry(scheduleID, day, time, desc, callback, db){
    const sqlQuery="update time_table set details=? where schedule_id=? and weekday=? and time=?";
    db.query(sqlQuery, [desc, scheduleID, day, time], (err, result)=>{
        if(err!=null){
            console.log(err);
        }
        else{
            callback(null, "success");
        }
    })
}

function getScheduleID(userID, callback, db){
    const sqlQuery="select * from schedule where user_id=?";
    db.query(sqlQuery, [userID], (err, result)=>{
        if(err!=null){
            console.log(err);
        }
        else{
            callback(null, result[0]);
        }
    })
}

function scheduleNotification(userID, scheduleID, callback, db){
    const table="schedule";
    const seen ="false";
    //const date= ""
    const desc="Your daily schedule";
    const sqlQuery="insert into actions (student_id, tables, table_id, see, action_desc) values (?, ?, ?, ?, ?)";
    db.query(sqlQuery, [userID, table, scheduleID, seen, desc], (err, result)=>{
        if(err!=null){
            console.log(err);
        }
        else{
            callback(null, "success");
        }
    })
}

module.exports={scheduleNotification, getScheduleID,changeTimeTableEntry, createSchedule, timeTableEntry};