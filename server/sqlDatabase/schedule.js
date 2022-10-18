function createSchedule(userID, startDate, endDate, callback, db){
    const sqlQuery="Insert into schedule (user_id, start_date, end_date) values (?, TO_DATE(?, 'DD/MM/YYYY'), TO_DATE(?, 'DD/MM/YYYY'))";
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
    const sqlQuery="Insert into time_table (schedule_id, weekday, time, desc) values (?, ?, ?,?)";
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
    const sqlQuery="update time_table set desc=? where schedule_id=? and weekday=? and time=?";
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
    const sqlQuery="select schedule_id from schedule where user_id=?";
    db.query(sqlQuery, [userID], (err, result)=>{
        if(err!=null){
            console.log(err);
        }
        else{
            callback(null, result[0]);
        }
    })
}

module.exports={getScheduleID,changeTimeTableEntry, createSchedule, timeTableEntry};