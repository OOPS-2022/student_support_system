function ticketTracker(ticketID, callback , db){
    const sqlSelect = "select * from investigation_record where ticket_id=?";
    db.query(sqlSelect, [ticketID], (err, result) => {
        if (err != null) {
            console.log(err);
            callback(err, null);
        }else{
            callback(null, result);
        }
    });
}

function myHearing(ticket_id,  callback , db){
    const sqlSelect = "select * from meetings where ticket_id=?";
    db.query(sqlSelect, [ticket_id], (err, result) => {
        if (err != null) {
            console.log(err);
            callback(err, null);
        }
        callback(null, result);
    });
}

function viewMyOffences(userID, callback, db){
    const sqlSelectNr = "select organization_nr from users where user_id=?";
    db.query(sqlSelectNr, [userID], (err, result) => {
        let orgNum = result[0].organization_nr;
        const sqlSelect ="select offender_name, (case when offence_list.offence_name='other' then other.offence_name else offence_list.offence_name end) as offence_name,logged_offences.ticket_id,crs_code, offence_status from logged_offences left join offence_list on logged_offences.offence_id= offence_list.offence_id left join other on logged_offences.ticket_id=other.ticket_id where offender_name=?";
        db.query(sqlSelect, [orgNum], (err, result) => {
            callback(null, result);
        });
    });
}

function insertOI(studNo, meetDate, meetLink, ticket_id, callback , db){
    const sqlInsertMeeting ="Insert into meetings (studNo, meetDate, meetLink,ticket_id) values(?,?,?,?)";
    const sqlSelect = "Select user_id from users where organization_nr=?";
    const sqlInsertAction ="Insert into actions (student_id, tables, table_id, seen, date, action_desc) values (?, ?, ?, ?, ?, ?)"; //used to send alert to student
    db.query(sqlInsertMeeting, [studNo, meetDate, meetLink, ticket_id], (err, result) => {
        if (err != null) {
        console.log(err);
        } 
        else {
            let student_id;
            db.query(sqlSelect, [studNo], (err, result) => {
                if (err != null) {
                    console.log(err);
                } 
                else {
                    student_id = result[0].user_id;
                    let table = "meeting";
                    let tableID = ticket_id;
                    let seen = "false";
                    let date = new Date().toISOString().slice(0, 10);
                    let actionDesc = "Hearing has been scheduled"; //message of alert sent to student
                    db.query(sqlInsertAction, [student_id, table, tableID, seen, date, actionDesc], (err, result) => {
                        if (err != null) {
                            callback(err, null) 
                        } 
                        else {
                            callback(null, "successful");
                        }
                        }
                    );
                }
            });
        }
    });
}

function updateOI(ticket_id,offence_status , callback , db){
    const sqlSelect ="UPDATE logged_offences SET offence_status = ? WHERE ticket_id = ?";
    db.query(sqlSelect, [offence_status, ticket_id], (err, result) => {
        if (err != null) {
            callback(err, null);
            return
        } 
        else {
            let student_id;
            const sqlGetStudent ="select user_id from users left join logged_offences on offender_name=organization_nr where ticket_id=?;";
            db.query(sqlGetStudent, [ticket_id], (err, result) => {
                if (err != null) {
                    callback(err, null);
                    return
                }else{
                    console.log(result);
                    student_id = result[0].user_id;
                    let table = "logged_offences";
                    let tableID = ticket_id;
                    let seen = "false";
                    let date = new Date().toISOString().slice(0, 10);
                    let actionDesc = "Your offence ticket has been updated";
                    const sqlInsertAction ="Insert into actions (student_id, tables, table_id, seen, date, action_desc) values (?, ?, ?, ?, ?, ?)"; //notification to student that a ticket has been updated
                    db.query(sqlInsertAction, [student_id, table, tableID, seen, date, actionDesc], (err, result) => {
                        if (err != null) {
                        callback(err, null);
                        return
                        } 
                        else {
                        callback(null, "successful");
                        }
                    });
                }
            });
        }
    });
}

function getEmail(stdNo, callback , db){
    const sqlSelect = "select email from users where organization_nr=?"; //get student email from database
    console.log(stdNo);
    db.query(sqlSelect, [stdNo], (err, result) => {
        console.log(result);
      callback(null, result[0].email);  
    })
}

function getAllMeetings(callback, db){
    const sqlQuery = "Select meetLink, meetDate from meetings;";
      db.query(sqlQuery, (error, result) => {
        callback(null,result);
      });
}

function getRole(userID, ticketID, callback, db){
    const sqlQuery="Select role from collaborators where user_id=? and ticket_id=?";
    db.query(sqlQuery, [userID, ticketID], (err, result)=>{
        console.log(result);
        callback(null, result);
    });
}

function addCollab(email, ticket_id,role, callback, db){
    const sqlSelect="select user_id from users where email=?";
    const sqlQuery="insert into collaborators (ticket_id, user_id, role) values (?, ?, ?)";
    db.query(sqlSelect, [email], (err, result)=>{
        //console.log(result[0].user_id);
        const user_id=result[0].user_id;
        db.query(sqlQuery, [ticket_id, user_id, role], (err, result) =>{
        callback(null, "successful");
        })
    })
    
}

function getPeople(ticket_id, callback, db){
    const sqlQuery="Select email, collaborators.role from collaborators left join users on collaborators.user_id=users.user_id where ticket_id=?";
    db.query(sqlQuery, [ticket_id], (err,result)=>{
        callback(null, result);
    })

}

function deleteCollab(email, ticket_id, callback, db){
    const sqlSelect="select user_id from users where email=?";
    const sqlQuery="delete from collaborators where user_id=? and ticket_id=?";
    db.query(sqlSelect, [email], (err, result)=>{
        //console.log(result[0].user_id);
        const user_id=result[0].user_id;
        db.query(sqlQuery, [user_id, ticket_id], (err, result) =>{
        callback(null, "successful");
        })
    })
}

module.exports= {deleteCollab,getAllMeetings,getEmail,updateOI,insertOI,viewMyOffences,ticketTracker, myHearing, getRole, addCollab, getPeople};
