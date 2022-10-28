
function PossibleOffences(callback, db){
  const sqlSelect ="select offence_id,offence_name, severity ,offence_desc from offence_list where offence_name != 'other'";
  db.query(sqlSelect, (error, result) => {
    if (error != null) {
      callback(error , null)
    }else{
      callback(null, result);
    }
  });
}

function SubmittedOffences(user_id , callback, db){
  const sqlSelect ="select logged_offences.ticket_id, offender_name, (case when offence_list.offence_name='other' then other.offence_name else offence_list.offence_name end) as offence_name,crs_code , offence_status from logged_offences left join offence_list on logged_offences.offence_id= offence_list.offence_id left join other on logged_offences.ticket_id=other.ticket_id left join collaborators on collaborators.ticket_id = logged_offences.ticket_id where collaborators.user_id = ?  or logged_offences.submitter_id = ? ";
  console.log(user_id);
  db.query(sqlSelect,[user_id, user_id],  (error, result) => {
    if (error != null) {
      callback(error , null)

    }else{
      callback(null, result);

    }
  });
}

function AllSubmittedOffences(callback, db){
  const sqlSelect ="select logged_offences.ticket_id, offender_name, (case when offence_list.offence_name='other' then other.offence_name else offence_list.offence_name end) as offence_name,crs_code , offence_status from logged_offences left join offence_list on logged_offences.offence_id= offence_list.offence_id left join other on logged_offences.ticket_id=other.ticket_id";
  db.query(sqlSelect, (error, result) => {
    if (error != null) {
      callback(error , null)

    }else{
      callback(null, result);
    }
  });
};

function insert(offenceName, severity, desc , callback , db){
  const sqlSelect ="Insert into offence_list(offence_name, severity, offence_desc) values(?,?,?)";
  db.query(sqlSelect, [offenceName, severity, desc], (err, result) => {
    if (err != null) {
      callback(err , null)
    }else{
      callback(null , 200)
    }
  });
}

function selectOffence(ticket_id , callback , db){

  const sqlSelect = "select * from logged_offences where ticket_id = ?";

  db.query(sqlSelect, [ticket_id], (err, result) => {
    if (err != null) {
      callback(err , null)
    }else{
      callback(null, result[0]);
    }
  });
}

function deleteOffence(offenceId , callback , db){
  const sqlSelect = "Delete from offence_list where offence_id = ?";
  db.query(sqlSelect, [offenceId], (err, result) => {
    if (err != null) {
      callback(err , null)
    }else{
      callback(null , 200)
    }
  });
}

function update(severity, offenceName, desc, offenceId , callback , db){
  const sqlSelect ="UPDATE offence_list SET severity = ?, offence_name =?, offence_desc=? WHERE offence_id = ?";
  db.query(sqlSelect,[severity, offenceName, desc, offenceId],(err, result) => {
    if (err != null) {
      callback(err , null)
    }else{
      callback(null , 200)
    }
    }
  );
}

module.exports= {update, deleteOffence,selectOffence,insert, SubmittedOffences, PossibleOffences ,AllSubmittedOffences};
