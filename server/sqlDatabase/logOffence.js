function LogOffenceNoFile(offenderName, offenceID, offenceDetails, offenceCode, offenceStatus, submittedBy,offenceType,offenceOther ,callback, db){
    const sqlSelect = "SELECT offence_id FROM offence_list WHERE offence_name = ?"; // get offence_id from table
    db.query(sqlSelect, [offenceType], (err, result) =>{
      if (result[0] != null) {
        offenceID = result[0].offence_id;
        const sqlInsert ="INSERT INTO logged_offences ( offender_name, offence_id, details, crs_code, offence_status, submitter_id ) VALUES (?,?,?,?,?,?);"; // insert into log table
        db.query(sqlInsert, [offenderName, offenceID, offenceDetails, offenceCode, offenceStatus, submittedBy],(err, result) => {
            const sqlGetId ="SELECT * FROM logged_offences ORDER BY ticket_id DESC LIMIT 1"; // get ticket_id the ticket we just created
            db.query(sqlGetId, (err, result) => {
              var ticket_id = result[0].ticket_id;
              const sqlInsert = "INSERT INTO other (ticket_id, offence_name) VALUES (?,?);"; // insert into log table
              if (offenceType === "other") {
                db.query(sqlInsert, [ticket_id, offenceOther], (err, result) => {
                  if (err !== null) {
                    //if there is an error inserting into other, delete the offence from logged_offences
                    const sqlDelete ="DELETE FROM logged_offences ORDER BY ticket_id DESC LIMIT 1";
                    db.query(sqlDelete, (err, result));
                    callback("Failed", null);
                    //return;
                  }
                }); 
              }
              //create directory to store all evidence related to this ticket
              const saveLink = "/Uploads/Evidence/ticket" + ticket_id;

              //now insert this directory into database
              const sqlUpdateLink ="Update logged_offences set ticket_link=? where ticket_id=?";
              db.query(sqlUpdateLink, [saveLink, ticket_id], (err, result) => {
                if (err != null) {
                  console.log(err);
                  callback(err, null);
                }
              });
              const sqlGetStudent ="select user_id from users where organization_nr=?"; //get student user id from database
              const sqlInsertAction ="Insert into actions (student_id, tables, table_id, seen, date, action_desc) values (?, ?, ?, ?, ?, ?)"; //this will allow the student to get an alert
              db.query(sqlGetStudent, [offenderName], (err, result) => {
                let student_id = result[0].user_id;
                let table = "logged_offence"; //this will later allow us to redirect the notifiaction to appropriate page
                let tableID = ticket_id;
                let seen = "false";
                let date = new Date().toISOString().slice(0, 10);
                let actionDesc = "An offence has been logged against you.";
                db.query(sqlInsertAction,[student_id, table, tableID, seen, date, actionDesc],(err, result) => {
                    if (err != null) {
                      console.log(err);
                      callback(err, null);
                    }else{
                      callback(null, ticket_id);
                    }
                  }
                );
              });
            });
          }
        );
      }
    });
}

function fetchOffenderEmail(offenderName, callback, db){
    const sqlSelectEmail = "select email from users where organization_nr=?"; //get student email from database
    db.query(sqlSelectEmail, [offenderName], (err, result) => {
        callback(null, result[0].email);
        //send email to student to alert them that an offence has been logged against them
    });
}


function LogOffence(offenderName, offenceID, offenceDetails, offenceCode, offenceStatus, submittedBy,offenceType,offenceOther, callback, db){
    const sqlSelect = "SELECT offence_id FROM offence_list WHERE offence_name = ?"; // get offence_id from table
      db.query(sqlSelect, [offenceType], (err, result) => {
        if (result[0] != null) {
          offenceID = result[0].offence_id;
          const sqlInsert ="INSERT INTO logged_offences ( offender_name, offence_id, details, crs_code, offence_status, submitter_id ) VALUES (?,?,?,?,?,?);"; // insert into log table
          db.query(sqlInsert, [offenderName, offenceID, offenceDetails, offenceCode, offenceStatus, submittedBy],(err, result) => {
            if(err!=null){
              console.log(err);
            }
              const sqlGetId ="SELECT * FROM logged_offences ORDER BY ticket_id DESC LIMIT 1"; // get ticket_id the ticket we just created
              db.query(sqlGetId, (err, result) => {
                ticket_id = result[0].ticket_id;
                console.log(ticket_id);
                const sqlInsert = "INSERT INTO other (ticket_id, offence_name) VALUES (?,?);"; // insert into log table
                if (offenceType === "other") {
                  db.query(sqlInsert, [ticket_id, offenceOther], (err, result) => {
                    if (err !== null) {
                      //if there is an error inserting into other, delete the offence from logged_offences
                      const sqlDelete ="DELETE FROM logged_offences ORDER BY ticket_id DESC LIMIT 1";
                      db.query(sqlDelete, (err, result));
                      callback("Failed", null);
                      //return;
                    }
                  });
                }
                //create directory to store all evidence related to this ticket
                const saveLink = "/Uploads/Evidence/ticket" + ticket_id;
                //now insert this directory into database
                const sqlUpdateLink ="Update logged_offences set ticket_link=? where ticket_id=?";
                db.query(sqlUpdateLink, [saveLink, ticket_id], (err, result) => {
                  if (err != null) {
                      callback(err, null);
                      console.log(err);
                  }
                });


    
                const sqlGetStudent ="select user_id from users where organization_nr=?"; //get student user id from database
                const sqlInsertAction ="Insert into actions (student_id, tables, table_id, seen, date, action_desc) values (?, ?, ?, ?, ?, ?)"; //this will allow the student to get an alert
                console.log(offenderName);
                db.query(sqlGetStudent, [offenderName], (err, result) => {
                  console.log(result);
                  if (err!=null){
                    console.log(err);
                  }
                  let student_id = result[0].user_id;
                  let table = "logged_offence"; //this will later allow us to redirect the notifiaction to appropriate page
                  let tableID = ticket_id;
                  let seen = "false";
                  let date = new Date().toISOString().slice(0, 10);
                  let actionDesc = "An offence has been logged against you.";
                  db.query(sqlInsertAction,[student_id, table, tableID, seen, date, actionDesc],(err, result) => {
                      if (err != null) {
                        console.log(err);
                        callback(err, null);
                      }else{
                        callback(null, ticket_id);
                      }
                    }
                  );
                });
              });
            }
          );
        }
      });
  }

module.exports = {LogOffenceNoFile, fetchOffenderEmail, LogOffence}