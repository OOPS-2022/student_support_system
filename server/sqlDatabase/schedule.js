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
    console.log(userID);
    const table="schedule";
    const seen ="false";
    //const date= ""
    const desc="Your daily schedule";
    const sqlQuery="insert into actions (student_id, tables, table_id, seen, action_desc) values (?, ?, ?, ?, ?)";
    db.query(sqlQuery, [userID, table, scheduleID, seen, desc], (err, result)=>{
        if(err!=null){
            console.log(err);
        }
        else{
            callback(null, "success");
        }
    })
}

function getEmails(callback, db){
    const sqlQuery="select email from schedule left join users on schedule.user_id = users.user_id where end_date>=current_date();"
    db.query(sqlQuery, (err, result)=>{
        if(err!=null){
            console.log(err);
        }
        else{
            callback(null, result);
        }
    })
}

function getTimeTable(scheduleID, callback, db){
    const sqlQuery="select * from time_table where schedule_id=?;"
    db.query(sqlQuery, [scheduleID], (err, result)=>{
        if(err!=null){
            console.log(err);
        }
        else{
            callback(null, result);
        }
    })
}

module.exports={getTimeTable, getEmails, scheduleNotification, getScheduleID,changeTimeTableEntry, createSchedule, timeTableEntry};